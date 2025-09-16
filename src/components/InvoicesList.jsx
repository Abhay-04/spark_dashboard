import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  loadInvoices,
  selectFilteredInvoices,
} from '../store/invoiceSlice'

export default function InvoiceList() {
  const dispatch = useDispatch()
  const invoices = useSelector(selectFilteredInvoices)

  useEffect(() => {
    dispatch(loadInvoices())
  }, [dispatch])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Invoices</h2>
       {invoices.length === 0 && <p>No invoices found.</p>}
      {invoices.map((inv) => (
        <div key={inv.id} className="p-2 border mb-2 rounded">
          <p>
            <strong>{inv.invoiceNumber}</strong> — {inv.customer}
          </p>
          <p>Status: {inv.status}</p>
          <p>Amount: {inv.amount}</p>
          <p>Due Date: {inv.dueDate}</p>
        </div>
      ))}
    </div>
  )
}
