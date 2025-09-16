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
    <div className="flex items-center justify-between rounded-xl border p-4 mb-3 bg-white shadow-sm">
      {/* Left Side */}
      <div>
        <p className="font-medium">{invoice.customer}</p>
        <p className="text-sm text-gray-500">
          ₹{invoice.amount.toLocaleString()}, Due:
          {new Date(invoice.dueDate).toLocaleDateString()}
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {invoice.isAdmin ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm">
                Update Status
              </Button>
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
        ) : (
          <Badge
            className={`${statusColors[invoice.status]} px-3 py-1 rounded-full`}
          >
            {invoice.status}
          </Badge>
        )}

        {invoice.reminder && (
          <Bell className="h-4 w-4 text-gray-400 cursor-pointer" />
        )}
      </div>
    </div>
  );
}
