import React from "react";
import { useInvoiceStore } from "../store/useInvoiceStore";
import InvoiceRow from "./InvoiceRow";

export default function InvoiceList() {
  const { invoices, updateInvoiceStatus } = useInvoiceStore();

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Your Invoices</h2>
      {invoices.map((inv) => (
        <InvoiceRow
          key={inv.id}
          invoice={inv}
          onStatusChange={updateInvoiceStatus}
        />
      ))}
    </div>
  );
}
