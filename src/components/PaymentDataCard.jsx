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
      <div className="rounded-xl border border-[#F2F2F2] bg-[#FFFFFF] p-4">
        <div className="text-sm text-[#999999] font-medium">Total Earnings</div>
        <div className="text-xl font-semibold text-[#8134AF] mt-1">
          ₹{format(totalEarnings)}
        </div>
      </div>
      {/* Row with two cards */}
      <div className="flex flex-row gap-3">
        <div className="flex-1 rounded-xl border border-[#F2F2F2] bg-[#FFFFFF] p-4">
          <div className="text-sm text-[#999999] font-medium">Payment Awaited</div>
          <div className="text-xl font-semibold text-[#8134AF] mt-1">
            ₹{format(paymentAwaited)}
          </div>
        </div>
        <div className="flex-1 rounded-xl border border-[#F2F2F2] bg-[#FFFFFF] p-4">
          <div className="text-sm text-[#999999] font-medium">Payment Overdue</div>
          <div className="text-xl font-semibold text-[#8134AF] mt-1">
            ₹{format(paymentOverdue)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentDataCard
