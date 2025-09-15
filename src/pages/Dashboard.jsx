import React, { useEffect } from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import InvoiceList from '@/components/InvoicesList';

export default function Dashboard() {
  const { invoices, loadInvoices } = useInvoiceStore();

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Invoices</h1>
      <InvoiceList />
    </div>
  );
}
