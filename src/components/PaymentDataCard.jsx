import { selectTotals } from '@/store/invoiceSlice'
import React from 'react'
import { useSelector } from 'react-redux'

const PaymentDataCard = () => {
  const { totalEarnings, paymentAwaited, paymentOverdue } =
    useSelector(selectTotals)

  // Helper for currency formatting if needed
  const format = (amount) =>
    typeof amount === 'number'
      ? amount.toLocaleString('en-IN')
      : amount

  return (
    <div className="w-full max-w-xxl mx-auto mt-4 flex flex-col gap-3">
      {/* Total Earnings full width card */}
      <div className="rounded-xl border border-gray-200 bg-white/80 p-4">
        <div className="text-sm text-gray-500">Total Earnings</div>
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mt-1">
          ₹{format(totalEarnings)}
        </div>
      </div>
      {/* Row with two cards */}
      <div className="flex flex-row gap-3">
        <div className="flex-1 rounded-xl border border-gray-200 bg-white/80 p-4">
          <div className="text-sm text-gray-500">Payment Awaited</div>
          <div className="text-lg font-bold text-purple-700 mt-1">
            ₹{format(paymentAwaited)}
          </div>
        </div>
        <div className="flex-1 rounded-xl border border-gray-200 bg-white/80 p-4">
          <div className="text-sm text-gray-500">Payment Overdue</div>
          <div className="text-lg font-bold text-purple-700 mt-1">
            ₹{format(paymentOverdue)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentDataCard
