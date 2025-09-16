import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { parseISO, isWithinInterval } from 'date-fns'

// Load invoices async from public/invoices.json
export const loadInvoices = createAsyncThunk(
  'invoices/loadInvoices',
  async () => {
    const saved = localStorage.getItem('invoices')
    if (saved) return JSON.parse(saved)
    const res = await fetch('/invoices.json')
    const data = await res.json()
    localStorage.setItem('invoices', JSON.stringify(data))
    return data
  }
)

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
  filterTime: 'All', // All, 1Month, Custom etc.
  customRange: null,
  status: 'idle', // loading state
}

const invoicesSlice = createSlice({
  name: 'invoices',
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
      const newInvoice = {
        id: `inv-${Math.random().toString(36).slice(2)}`,
        ...action.payload,
      }
      state.invoices.unshift(newInvoice)
      localStorage.setItem('invoices', JSON.stringify(state.invoices))
    },
    updateInvoiceStatus: (state, action) => {
      const { id, status } = action.payload
      state.invoices = state.invoices.map((inv) =>
        inv.id === id ? { ...inv, status } : inv
      )
      localStorage.setItem('invoices', JSON.stringify(state.invoices))
    },
    setFilterTime: (state, action) => {
      state.filterTime = action.payload
    },
    setCustomRange: (state, action) => {
      state.customRange = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInvoices.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadInvoices.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.invoices = action.payload
      })
      .addCase(loadInvoices.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const {
    setForm,
  resetForm,
  addInvoice,
  updateInvoiceStatus,
  setFilterTime,
  setCustomRange,
} = invoicesSlice.actions

// Selector for filtered invoices

export const selectFilteredInvoices = (state) => {
  const { invoices, filterTime, customRange } = state.invoices
  if (!invoices.length) return []

  // --- Custom range filter ---
  if (
    filterTime === 'Custom' &&
    customRange?.from &&
    customRange?.to
  ) {
    return invoices.filter((inv) =>
      isWithinInterval(parseISO(inv.dueDate), {
        start: customRange.from,
        end: customRange.to,
      })
    )
  }

  // current date
  const now = new Date()

  // --- 1 Month filter ---
  if (filterTime === '1Month') {
    const start = new Date()
    start.setMonth(start.getMonth() - 1)
    return invoices.filter((inv) => new Date(inv.dueDate) >= start)
  }

  // --- 3 Months filter ---
  if (filterTime === '3Months') {
    const start = new Date()
    start.setMonth(start.getMonth() - 3)
    return invoices.filter((inv) => new Date(inv.dueDate) >= start)
  }

  // --- 1 Year filter ---
  if (filterTime === '1Year') {
    const start = new Date()
    start.setFullYear(start.getFullYear() - 1)
    return invoices.filter((inv) => new Date(inv.dueDate) >= start)
  }

  // default (All)
  return invoices
}


// Totals
export const selectTotals = (state) => {
  const invoices = selectFilteredInvoices(state)
  const totalEarnings = invoices.reduce((acc, inv) => acc + inv.amount, 0)
  const paymentAwaited = invoices
    .filter((inv) => inv.status === 'Awaited' || inv.status === 'Unpaid')
    .reduce((acc, inv) => acc + inv.amount, 0)
  const paymentOverdue = invoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((acc, inv) => acc + inv.amount, 0)

  return { totalEarnings, paymentAwaited, paymentOverdue }
}

export default invoicesSlice.reducer
