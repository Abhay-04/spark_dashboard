import React from "react";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const statusColors = {
  Paid: "bg-green-100 text-green-700",
  Overdue: "bg-red-100 text-red-700",
  Awaited: "bg-yellow-100 text-yellow-700",
  "Partially Paid": "bg-yellow-100 text-yellow-700",
  Disputed: "bg-red-200 text-red-700",
  Unpaid: "bg-gray-100 text-gray-600",
};

export default function InvoiceRow({ invoice, onStatusChange }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white/90 p-4 mb-2 shadow-sm min-h-[82px]">
      {/* Left */}
      <div>
        <p className="font-medium">{invoice.customer || "Income Trend"}</p>
        <p className="text-sm text-gray-500">
          ₹{invoice.amount?.toLocaleString("en-IN") || "1,25,000"}, Due:{" "}
          {invoice.dueDate
            ? new Date(invoice.dueDate).toLocaleDateString("en-CA")
            : "2024-06-15"}
        </p>
      </div>
      {/* Right */}
      <div className="flex items-center gap-2">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Badge
        className={`cursor-pointer px-4 py-1 text-sm font-medium rounded-full ${
          statusColors[invoice.status]
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

  {["Overdue", "Awaited", "Unpaid" , "Partially Paid"].includes(invoice.status) && (
    <Bell className="h-4 w-4 text-gray-400 ml-1" />
  )}
</div>

    </div>
  );
}
