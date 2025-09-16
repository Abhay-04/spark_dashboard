import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setFilterTime,
  setCustomRange,
} from '../store/invoiceSlice'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, Crown } from 'lucide-react'
import { Button } from './ui/button'

export default function TimeFilter() {
  const dispatch = useDispatch()
  const filterTime = useSelector((state) => state.invoices.filterTime)
  const customRange = useSelector((state) => state.invoices.customRange)

  // Helper for displaying date string
  const formatRange = (range) => {
    if (!range?.from || !range?.to) return "dd:mm:yyyy - dd:mm:yyyy"
    const format = date =>
      `${date.getDate().toString().padStart(2, '0')}:` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}:` +
      `${date.getFullYear()}`
    return `${format(range.from)} - ${format(range.to)}`
  }

  return (
    <div className="rounded-2xl bg-white/80 border border-gray-200 shadow-sm px-4 py-4 flex flex-col w-[340px] max-w-xxl mt-4">
      <div className="flex justify-between pb-2 px-1">
        <span className="font-medium text-gray-800 text-[15px]">Time Period</span>
        <span className="text-gray-400 text-xs">{formatRange(filterTime === 'Custom' ? customRange : undefined)}</span>
      </div>
      <div className="flex gap-3 pt-1 flex-wrap">
        <button
          className={`text-xs px-4 py-1 rounded-full border transition
            ${filterTime === '1Month'
              ? 'bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow'
              : 'border-gray-200 text-gray-600 bg-white hover:bg-purple-100'}
          `}
          onClick={() => dispatch(setFilterTime('1Month'))}
        >
          1Month
        </button>
        <button
          className={`text-xs px-4 py-1 rounded-full border transition
            ${filterTime === '3Months'
              ? 'bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow'
              : 'border-gray-200 text-gray-600 bg-white hover:bg-purple-100'}
          `}
          onClick={() => dispatch(setFilterTime('3Months'))}
        >
          3Months
        </button>
        <button
          className={`text-xs px-4 py-1 rounded-full border flex items-center gap-1 transition
            ${filterTime === '1Year'
              ? 'bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow'
              : 'border-gray-200 text-gray-700 bg-white hover:bg-purple-100'}
          `}
          onClick={() => dispatch(setFilterTime('1Year'))}
        >
          1Year 
          <Crown className="inline w-4 h-4 ml-1 text-yellow-400" />
        </button>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`text-xs px-4 py-1 flex items-center border rounded-full gap-1 transition
                ${filterTime === 'Custom'
                  ? 'border-purple-400 text-purple-700 bg-purple-50'
                  : 'border-gray-200 text-gray-700 bg-white hover:bg-purple-100'}
              `}
              onClick={() => dispatch(setFilterTime('Custom'))}
            >
              <CalendarIcon className="h-4 w-4" />
              Custom
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <Calendar
              mode="range"
              selected={customRange}
              onSelect={(range) => {
                dispatch(setCustomRange(range))
                dispatch(setFilterTime('Custom'))
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
