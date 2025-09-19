import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { parseISO, isWithinInterval } from "date-fns";

// --- Fetch invoices from MockAPI ---
export const loadInvoices = createAsyncThunk(
  "invoices/loadInvoices",
  async () => {
    const saved = localStorage.getItem("invoices");
    if (saved) return JSON.parse(saved);

    // fetch from MockAPI
    const res = await fetch(
      "https://68ca7f27430c4476c349b61c.mockapi.io/api/v1/invoices"
    );
    if (!res.ok) throw new Error("Failed to fetch invoices");
    const apiData = await res.json();

    // map API data to your app's format
    const mappedData = apiData.map((item) => ({
      id: item.id,
      customer: item.client_name, // rename from client_name
      amount: Number(item.due_amount), // rename from due_amount and ensure number
      dueDate: item.due_date, // rename from due_date
      status: item.status
        ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
        : null, // capitalize first letter
      reminder: false, // your extra field
      paidDate: null, // your extra field for tracking payment dates
    }));

    localStorage.setItem("invoices", JSON.stringify(mappedData));
    return mappedData;
  }
);

// --- Initial State ---
const initialState = {
  invoices: [],
  form: {
    invoiceNumber: "",
    customer: "",
    amount: "",
    dueDate: "",
    status: "Unpaid",
    reminder: false,
  },
  filterTime: "All", // All, 1Month, Custom etc.
  customRange: null,
  status: "idle", // loading state
  error: null, // Add error state
  searchText: '', // Add search functionality
};

// --- Slice ---
const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setForm: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    resetForm: (state) => {
      state.form = {
        invoiceNumber: "",
        customer: "",
        amount: "",
        dueDate: "",
        status: "Unpaid",
        reminder: false,
      };
    },
    addInvoice: (state, action) => {
      try {
        // Validate required fields
        const { customer, amount, dueDate } = action.payload;
        if (!customer || !amount || !dueDate) {
          console.error("Missing required fields for invoice");
          return;
        }

        // Create new invoice with proper data types
        const newInvoice = {
          id: `inv-${Date.now()}-${Math.random().toString(36).slice(2)}`, // More unique ID
          customer: String(customer).trim(),
          amount: Number(amount), // Ensure it's a number
          dueDate: dueDate, // Keep as string in YYYY-MM-DD format
          status: action.payload.status || "Unpaid",
          reminder: Boolean(action.payload.reminder || false),
          createdAt: new Date().toISOString(), // Add timestamp
          paidDate: null, // Add paidDate field
        };

        // Add to beginning of array
        state.invoices.unshift(newInvoice);
        
        // Update localStorage
        localStorage.setItem("invoices", JSON.stringify(state.invoices));
        
        console.log("Invoice added successfully:", newInvoice);
      } catch (error) {
        console.error("Error adding invoice:", error);
        state.error = "Failed to add invoice";
      }
    },
    updateInvoiceStatus: (state, action) => {
      try {
        const { id, status } = action.payload;
        const invoiceIndex = state.invoices.findIndex((inv) => inv.id === id);
        
        if (invoiceIndex !== -1) {
          state.invoices[invoiceIndex].status = status;
          localStorage.setItem("invoices", JSON.stringify(state.invoices));
          console.log(`Invoice ${id} status updated to ${status}`);
        } else {
          console.error(`Invoice with id ${id} not found`);
        }
      } catch (error) {
        console.error("Error updating invoice status:", error);
        state.error = "Failed to update invoice status";
      }
    },
    deleteInvoice: (state, action) => {
      try {
        const id = action.payload;
        state.invoices = state.invoices.filter((inv) => inv.id !== id);
        localStorage.setItem("invoices", JSON.stringify(state.invoices));
        console.log(`Invoice ${id} deleted successfully`);
      } catch (error) {
        console.error("Error deleting invoice:", error);
        state.error = "Failed to delete invoice";
      }
    },
    setFilterTime: (state, action) => {
      state.filterTime = action.payload;
    },
    setCustomRange: (state, action) => {
      state.customRange = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInvoices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadInvoices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.invoices = action.payload;
        state.error = null;
      })
      .addCase(loadInvoices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load invoices";
      });
  },
});

// --- Actions ---
export const {
  setForm,
  resetForm,
  addInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  setFilterTime,
  setCustomRange,
  setSearchText,
  clearError,
} = invoicesSlice.actions;

// --- Selector for filtered invoices ---
export const selectFilteredInvoices = (state) => {
  const { invoices, filterTime, customRange, searchText } = state.invoices;
  if (!invoices.length) return [];

  let filteredInvoices = invoices;

  // --- Search filter (applied first) ---
  if (searchText && searchText.trim()) {
    const lower = searchText.toLowerCase();
    filteredInvoices = filteredInvoices.filter((inv) =>
      inv.customer.toLowerCase().includes(lower)
    );
  }

  // --- Custom range filter ---
  if (filterTime === "Custom" && customRange?.from && customRange?.to) {
    return filteredInvoices.filter((inv) => {
      try {
        return isWithinInterval(parseISO(inv.dueDate), {
          start: customRange.from,
          end: customRange.to,
        });
      } catch (error) {
        console.error("Error parsing date:", inv.dueDate, error);
        return false;
      }
    });
  }

  // current date
  const now = new Date();

  // --- 1 Month filter ---
  if (filterTime === "1Month") {
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return filteredInvoices.filter((inv) => new Date(inv.dueDate) >= start);
  }

  // --- 3 Months filter ---
  if (filterTime === "3Months") {
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    return filteredInvoices.filter((inv) => new Date(inv.dueDate) >= start);
  }

  // --- 1 Year filter ---
  if (filterTime === "1Year") {
    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    return filteredInvoices.filter((inv) => new Date(inv.dueDate) >= start);
  }

  // default (All) - return search filtered results or all invoices
  return filteredInvoices;
};

// --- Totals ---
export const selectTotals = (state) => {
  const invoices = selectFilteredInvoices(state);
  const totalEarnings = invoices.reduce((acc, inv) => {
    const amount = Number(inv.amount) || 0; // Ensure it's a number
    return acc + amount;
  }, 0);
  
  const paymentAwaited = invoices
    .filter((inv) => inv.status === "Awaited" || inv.status === "Unpaid")
    .reduce((acc, inv) => {
      const amount = Number(inv.amount) || 0;
      return acc + amount;
    }, 0);
    
  const paymentOverdue = invoices
    .filter((inv) => inv.status === "Overdue")
    .reduce((acc, inv) => {
      const amount = Number(inv.amount) || 0;
      return acc + amount;
    }, 0);

  return { totalEarnings, paymentAwaited, paymentOverdue };
};

// --- Additional selectors ---
export const selectInvoiceById = (state, invoiceId) => {
  return state.invoices.invoices.find((inv) => inv.id === invoiceId);
};

export const selectInvoicesByStatus = (state, status) => {
  const invoices = selectFilteredInvoices(state);
  return invoices.filter((inv) => inv.status === status);
};

export default invoicesSlice.reducer;