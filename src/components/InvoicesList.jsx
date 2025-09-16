import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadInvoices,
  selectFilteredInvoices,
  updateInvoiceStatus,
} from "../store/invoiceSlice";
import InvoiceRow from "./InvoiceRow";
import { ChevronDown } from "lucide-react";

export default function InvoiceList() {
  const dispatch = useDispatch();
  const invoices = useSelector(selectFilteredInvoices);

  useEffect(() => {
    dispatch(loadInvoices());
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateInvoiceStatus({ id, status }));
    // Optionally: Make an API call here for persistent save
  };

  return (
    <div className="w-full max-w-xxl mx-auto mt-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-sm text-gray-500 font-semibold">Your Invoices</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
      <div>
        {invoices.length === 0 && (
          <p className="text-center text-gray-400 font-medium py-6">
            No invoices found.
          </p>
        )}
        {invoices.map((inv) => (
          <InvoiceRow
            key={inv.id}
            invoice={inv}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
