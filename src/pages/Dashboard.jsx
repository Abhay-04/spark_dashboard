import React from 'react'
import { useSelector } from 'react-redux'
import { selectTotals } from '../store/invoiceSlice'
import TimeFilter from '../components/TimeFilter'
import InvoiceList from '../components/InvoicesList'
import NewInvoiceForm from '@/components/NewInvoiceForm'

export default function Dashboard() {
  const { totalEarnings, paymentAwaited, paymentOverdue } =
    useSelector(selectTotals)

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <NewInvoiceForm />
      <TimeFilter />
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-4 border rounded">
          Total Earnings: {totalEarnings}
        </div>
        <div className="p-4 border rounded">
          Payment Awaited: {paymentAwaited}
        </div>
        <div className="p-4 border rounded">
          Payment Overdue: {paymentOverdue}
        </div>
      </div>
      <InvoiceList />
    </div>
  )
}
