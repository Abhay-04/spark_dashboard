import React from 'react'
import { useSelector } from 'react-redux'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'

const IncomeTrendChart = () => {
  const invoices = useSelector((state) => state.invoices.invoices)

  // Generate last 6 months data
  const generateMonthlyData = () => {
    const months = []
    const currentDate = new Date()
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = date.toLocaleString('default', { month: 'short' })
      months.push({
        month: monthName,
        date: date,
        income: 0
      })
    }

    // Calculate income for each month from paid invoices
    invoices.forEach(invoice => {
      if (invoice.status === 'Paid') {
        const invoiceDate = new Date(invoice.dueDate)
        const invoiceMonth = invoiceDate.getMonth()
        const invoiceYear = invoiceDate.getFullYear()
        
        months.forEach(monthData => {
          if (monthData.date.getMonth() === invoiceMonth && 
              monthData.date.getFullYear() === invoiceYear) {
            monthData.income += invoice.amount
          }
        })
      }
    })

    // Calculate month-over-month growth percentage
    months.forEach((month, index) => {
      if (index === 0) {
        month.momGrowth = 0
      } else {
        const prevIncome = months[index - 1].income
        if (prevIncome === 0) {
          month.momGrowth = month.income > 0 ? 100 : 0
        } else {
          month.momGrowth = ((month.income - prevIncome) / prevIncome) * 100
        }
      }
    })

    return months
  }

  const data = generateMonthlyData()

  // Format currency
  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`
    }
    return `$${value.toFixed(0)}`
  }

  // Format percentage
  const formatPercentage = (value) => `${value.toFixed(0)}%`

  // Custom dot component for the line
  const CustomDot = (props) => {
    const { cx, cy, fill } = props
    return <circle cx={cx} cy={cy} r={3} fill="#8B5A2B" stroke="#8B5A2B" strokeWidth={2} />
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Income Trend</h3>
        <p className="text-sm text-gray-600 mt-1">
          Your monthly income and growth for the last 6 months.
        </p>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 60,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatCurrency}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatPercentage}
            />
            
            <Bar 
              yAxisId="left"
              dataKey="income" 
              fill="#8B5CF6" 
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
            
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="momGrowth" 
              stroke="#8B5A2B" 
              strokeWidth={3}
              dot={<CustomDot />}
              connectNulls={false}
            />
            
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="rect"
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '12px'
              }}
              formatter={(value) => value === 'income' ? 'Income' : 'Mom Growth'}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default IncomeTrendChart