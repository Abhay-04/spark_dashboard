// src/store/useInvoiceStore.js
import { create } from 'zustand';

export const useInvoiceStore = create((set) => ({
  invoices: [],           // all invoices
  form: {                 // form fields for new invoice
    invoiceNumber: '',
    customer: '',
    amount: '',
    dueDate: '',
    status: 'Unpaid',
    reminder: false,
  },

  // Load invoices from JSON or localStorage
  loadInvoices: async () => {
    const saved = localStorage.getItem('invoices');
    if (saved) {
      set({ invoices: JSON.parse(saved) });
    } else {
      const res = await fetch('/invoices.json'); // in public/
      const data = await res.json();
      set({ invoices: data });
      localStorage.setItem('invoices', JSON.stringify(data));
    }
  },

  // Add new invoice
  addInvoice: (invoice) => set((state) => {
    const newInvoice = {
      id: `inv-${Math.random().toString(36).slice(2)}`,
      ...invoice,
    };
    const updated = [newInvoice, ...state.invoices];
    localStorage.setItem('invoices', JSON.stringify(updated));
    return { invoices: updated };
  }),

  // Update form fields
  setForm: (data) => set((state) => ({
    form: { ...state.form, ...data }
  })),

  // Reset form
  resetForm: () => set({
    form: {
      invoiceNumber: '',
      customer: '',
      amount: '',
      dueDate: '',
      status: 'Unpaid',
      reminder: false,
    }
  }),
}));
