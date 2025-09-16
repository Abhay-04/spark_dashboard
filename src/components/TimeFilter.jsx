import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setFilterTime,
  setCustomRange,
} from '../store/invoiceSlice'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { Button } from './ui/button'

export default function TimeFilter() {
  const dispatch = useDispatch()
  const filterTime = useSelector((state) => state.invoices.filterTime)
  const customRange = useSelector((state) => state.invoices.customRange)

 

  return (
    <div className="flex gap-2">
      <button
        className={filterTime === 'All' ? 'bg-purple-500 text-white' : 'border'}
        onClick={() => dispatch(setFilterTime('All'))}
      >
        All
      </button>
      <button
        className={filterTime === '1Month' ? 'bg-purple-500 text-white' : 'border'}
        onClick={() => dispatch(setFilterTime('1Month'))}
      >
        1 Month
      </button>
      <button
        className={filterTime === '3Months' ? 'bg-purple-500 text-white' : 'border'}
        onClick={() => dispatch(setFilterTime('3Months'))}
      >
        3 Months
      </button>
      <button
        className={filterTime === '1Year' ? 'bg-purple-500 text-white' : 'border'}
        onClick={() => dispatch(setFilterTime('1Year'))}
      >
        1 Year
      </button>
    {/* Custom date range */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={filterTime === 'Custom' ? 'default' : 'outline'}
            className="flex items-center gap-1"
            onClick={() => dispatch(setFilterTime('Custom'))}
          >
            <CalendarIcon className="h-4 w-4" /> Custom
          </Button>
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
  )
}
