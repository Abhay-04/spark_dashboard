import { create } from "zustand";
// import { differenceInMonths, isWithinInterval, parseISO } from "date-fns";

export const useInvoiceStore = create((set, get) => ({
  invoices: [],
  form: {
    invoiceNumber: "",
    customer: "",
    amount: "",
    dueDate: "",
    status: "Unpaid",
    reminder: false,
  },

  // --- NEW FILTER STATE ---
  filter: "ALL", // default filter
  customRange: null,

  // --- EXISTING ACTIONS ---
  loadInvoices: async () => {
    const saved = localStorage.getItem("invoices");
    if (saved) {
      set({ invoices: JSON.parse(saved) });
    } else {
      const res = await fetch("/invoices.json");
      const data = await res.json();
      set({ invoices: data });
      localStorage.setItem("invoices", JSON.stringify(data));
    }
  },

  addInvoice: (invoice) =>
    set((state) => {
      const newInvoice = {
        id: `inv-${Math.random().toString(36).slice(2)}`,
        ...invoice,
      };
      const updated = [newInvoice, ...state.invoices];
      localStorage.setItem("invoices", JSON.stringify(updated));
      return { invoices: updated };
    }),

  setForm: (data) =>
    set((state) => ({
      form: { ...state.form, ...data },
    })),

  resetForm: () =>
    set({
      form: {
        invoiceNumber: "",
        customer: "",
        amount: "",
        dueDate: "",
        status: "Unpaid",
        reminder: false,
      },
    }),

  updateInvoiceStatus: (id, status) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, status } : inv
      ),
    })),

  // --- NEW ACTIONS ---
  setFilter: (filter) => set({ filter}),
  // setCustomRange: (range) => set({ customRange: range }),

//   // --- FILTERED INVOICES DERIVED FUNCTION ---
//  // inside your store
// getFilteredInvoices: () => {
//   const { invoices, filterTime, customRange } = get();
//   if (!invoices.length) return [];
//    console.log("HELL" , invoices);

//   const now = new Date();
//     console.log("first")

//   // --- custom range ---
//   if (filterTime === "Custom" && customRange?.from && customRange?.to) {
//     return invoices.filter((inv) =>
//       isWithinInterval(parseISO(inv.dueDate), {
//         start: customRange.from,
//         end: customRange.to,
//       })
//     );
//   }

//   // --- time-based filters ---
//   if (filterTime === "1Month") {
//     console.log("111")
//     console.log(invoices);
//     const start = new Date();
//     start.setMonth(start.getMonth() - 1);
//     return invoices.filter((inv) => parseISO(inv.dueDate) >= start);
//   }

//   if (filterTime === "3Months") {
//     const start = new Date();
//     start.setMonth(start.getMonth() - 3);
//     return invoices.filter((inv) => parseISO(inv.dueDate) >= start);
//   }

//   if (filterTime === "1Year") {
//     const start = new Date();
//     start.setFullYear(start.getFullYear() - 1);
//     return invoices.filter((inv) => parseISO(inv.dueDate) >= start);
//   }

//   return invoices; // default
// },


// inside your store
getFilteredInvoices: () => {
  const { invoices, filterTime } = get();
  if (!invoices.length) return [];

  // default: return all
  if (filterTime !== "1Month") return invoices;

  // 1 month ago from today
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return invoices.filter((inv) => {
    const due = new Date(inv.dueDate); // parse date
    // include invoices with dueDate within the last 1 month
    return due >= oneMonthAgo;
  });
},


  // --- OPTIONAL TOTALS ---
  getTotals: () => {
    const invoices = get().getFilteredInvoices();
    const totalEarnings = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paymentAwaited = invoices
      .filter((inv) => inv.status === "Awaited")
      .reduce((sum, inv) => sum + inv.amount, 0);
    const overdue = invoices
      .filter((inv) => inv.status === "Overdue")
      .reduce((sum, inv) => sum + inv.amount, 0);
    return { totalEarnings, paymentAwaited, overdue };
  },
}));



