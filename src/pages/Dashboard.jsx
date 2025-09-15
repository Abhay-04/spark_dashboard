import React, { useEffect } from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import InvoiceList from '@/components/InvoicesList';
import StatsCard from '@/components/StatsCard';


export default function Dashboard() {

  const { invoices, loadInvoices } = useInvoiceStore();
  const totalEarnings = invoices.reduce((acc, inv) => acc + inv.amount, 0);
const paymentAwaited = invoices
  .filter(inv => inv.status === 'Awaited' || inv.status === 'Unpaid')
  .reduce((acc, inv) => acc + inv.amount, 0);
const paymentOverdue = invoices
  .filter(inv => inv.status === 'Overdue')
  .reduce((acc, inv) => acc + inv.amount, 0);

  

  

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  

  return (
    
    <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <StatsCard title="Total Earnings" amount={totalEarnings} color="text-purple-600" />
  <StatsCard title="Payment Awaited" amount={paymentAwaited} color="text-yellow-600" />
  <StatsCard title="Payment Overdue" amount={paymentOverdue} color="text-red-600" />
</div>

        
      <h1 className="text-xl font-bold mb-4">Invoices</h1>
      <InvoiceList />
    </div>
  );
}
