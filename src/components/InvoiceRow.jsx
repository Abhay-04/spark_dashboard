import React from "react";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Slide, toast } from "react-toastify"; // <-- add this

const statusColors = {
  Paid: "bg-[#9CEFB8] text-[#34C759]",
  Overdue: "bg-[#FFB1B1] text-[#FF2D55]",
  Awaited: "bg-[#FFFAE5] text-[#FFCC00]",
  "Partially Paid": "bg-[#FFFAE5] text-[#FFCC00]",
  Disputed: "bg-[#FFB1B1] text-[#FF2D55]",
  Unpaid: "bg-[#F2F2F2] text-[#999999]",
};

export default function InvoiceRow({ invoice, onStatusChange }) {
  const handleReminder = () => {
    toast.success(`Reminder sent to ${invoice.customer || "client"}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      transition: Slide,
    });
  };

  const hasStatus = invoice.status?.trim(); // ensures no whitespace

  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#F2F2F2] bg-[#FFFFFF] p-4 mb-2 shadow-sm min-h-[82px]">
      {/* Left */}
      <div>
        <p className="font-semibold text-[#6B7280] text-sm">
          {invoice.customer || "Income Trend"}
        </p>
        <p className="text-xs font-normal text-[#999999] mt-1">
          ₹{invoice.amount?.toLocaleString("en-IN") || "1,25,000"}, Due:{" "}
          {invoice.dueDate
            ? new Date(invoice.dueDate).toLocaleDateString("en-CA")
            : "2024-06-15"}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Only render badge + dropdown if status exists */}
        {hasStatus && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge
                className={`cursor-pointer px-4 py-1 text-xs font-bold rounded-full ${
                  statusColors[invoice.status] || "bg-gray-300 text-gray-800"
                }`}
              >
                {invoice.status}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.keys(statusColors).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => onStatusChange(invoice.id, s)}
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {["Overdue", "Awaited", "Unpaid", "Partially Paid", "Disputed"].includes(
          invoice.status
        ) && (
          <Bell
            onClick={handleReminder}
            className="h-4 w-4 text-gray-400 ml-1 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
