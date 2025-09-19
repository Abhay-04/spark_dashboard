import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { setForm, resetForm, addInvoice } from "../store/invoiceSlice";

const NewInvoiceForm = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const form = useSelector((state) => state.invoices.form);
  const invoices = useSelector((state) => state.invoices.invoices);
  const error = useSelector((state) => state.invoices.error);

  const generateInvoiceNumber = () => {
    const existingNumbers = invoices
      .map((inv) => inv.invoiceNumber)
      .filter((num) => num && num.startsWith("INV-"))
      .map((num) => parseInt(num.replace("INV-", ""), 10))
      .filter((num) => !isNaN(num));
    
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNumber = maxNumber + 1;
    return `INV-${nextNumber.toString().padStart(3, "0")}`;
  };

  // Set invoice number when dialog opens
  useEffect(() => {
    if (open && !form.invoiceNumber) {
      const newInvoiceNumber = generateInvoiceNumber();
      dispatch(setForm({ invoiceNumber: newInvoiceNumber }));
    }
  }, [open, form.invoiceNumber, dispatch, generateInvoiceNumber]);

  const handleInputChange = (field, value) => {
    dispatch(setForm({ [field]: value }));
  };

  const validateForm = () => {
    if (!form.invoiceNumber?.trim()) {
      alert("Invoice number is required");
      return false;
    }
    if (!form.customer?.trim()) {
      alert("Customer name is required");
      return false;
    }
    if (!form.amount || parseFloat(form.amount) <= 0) {
      alert("Please enter a valid amount greater than 0");
      return false;
    }
    if (!form.dueDate) {
      alert("Due date is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check for duplicate invoice numbers
      const duplicateInvoice = invoices.find(
        (inv) => inv.invoiceNumber === form.invoiceNumber
      );
      
      if (duplicateInvoice) {
        alert("Invoice number already exists. Please use a different number.");
        setIsSubmitting(false);
        return;
      }

      const invoiceData = {
        invoiceNumber: form.invoiceNumber.trim(),
        customer: form.customer.trim(),
        amount: parseFloat(form.amount),
        dueDate: form.dueDate,
        status: form.status || "Unpaid",
        reminder: Boolean(form.reminder),
      };

      console.log("Submitting invoice:", invoiceData);
      
      dispatch(addInvoice(invoiceData));
      
      // Reset form and close dialog
      dispatch(resetForm());
      setOpen(false);
      
    
      
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    dispatch(resetForm());
    setOpen(false);
  };

  const handleDialogChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset form when dialog closes
      dispatch(resetForm());
    }
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="w-full lg:w-full max-w-xxl mx-auto mt-8 mb-6 bg-[#F2F2F2] rounded-3xl shadow-lg flex flex-col items-center px-6 py-4 hover:cursor-pointer hover:bg-[#EEEEEE] transition-colors duration-200"
      >
        <button
          className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-purple-200 bg-white mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          onClick={() => setOpen(true)}
          aria-label="Create New Invoice"
        >
          <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#DD2A7B] via-[#9747FF] to-[#334CCA] p-1.5">
            <div className="bg-white rounded-full flex items-center justify-center w-12 h-12">
              <Plus className="w-10 h-10 text-[#9747FF] font-extrabold" />
            </div>
          </div>
        </button>

        <div className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-400 text-transparent bg-clip-text mb-2">
          Create New Invoice
        </div>

        <div className="text-[#999999] text-xs text-center">
          Start by creating and sending new invoice
        </div>
      </div>
      
      <div className="text-center">
        <button className="text-xs text-[#8134AF] hover:underline mx-auto">
          Or Upload an existing invoice and set payment reminder
        </button>
      </div>

      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-md shadow-lg border border-purple-300">
          <DialogHeader>
            <DialogTitle className="text-purple-700 font-semibold">
              Create New Invoice
            </DialogTitle>
            <DialogDescription>
              Fill in the invoice details below. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="invoiceNumber"
                  className="text-right text-purple-700 font-medium"
                >
                  Invoice
                </Label>
                <Input
                  id="invoiceNumber"
                  value={form.invoiceNumber || ""}
                  placeholder="INV-001"
                  className="col-span-3 border border-purple-400 focus:border-purple-600 focus:ring focus:ring-purple-300 rounded-md bg-gray-100"
                  disabled
                  readOnly
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="customer"
                  className="text-right text-purple-700 font-medium"
                >
                  Customer*
                </Label>
                <Input
                  id="customer"
                  value={form.customer || ""}
                  onChange={(e) => handleInputChange("customer", e.target.value)}
                  placeholder="Customer name"
                  className="col-span-3 border border-purple-400 focus:border-purple-600 focus:ring focus:ring-purple-300 rounded-md hover:cursor-pointer"
                  required
                  maxLength={100}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="amount"
                  className="text-right text-purple-700 font-medium"
                >
                  Amount*
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.amount || ""}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="0.00"
                  className="col-span-3 border border-purple-400 focus:border-purple-600 focus:ring focus:ring-purple-300 rounded-md hover:cursor-pointer"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="dueDate"
                  className="text-right text-purple-700 font-medium"
                >
                  Due Date*
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={form.dueDate || ""}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className="col-span-3 border border-purple-400 focus:border-purple-600 focus:ring focus:ring-purple-300 rounded-md hover:cursor-pointer"
                  required
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="status"
                  className="text-right text-purple-700 font-medium"
                >
                  Status
                </Label>
                <Select
                  value={form.status || "Unpaid"}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="col-span-3 border border-purple-400 focus:border-purple-600 focus:ring focus:ring-purple-300 rounded-md hover:cursor-pointer">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Awaited">Awaited</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="reminder"
                  className="text-right text-purple-700 font-medium"
                >
                  Reminder
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="reminder"
                    checked={Boolean(form.reminder)}
                    onCheckedChange={(checked) =>
                      handleInputChange("reminder", checked)
                    }
                    className="border-purple-600 checked:bg-purple-600 hover:cursor-pointer"
                  />
                  <Label
                    htmlFor="reminder"
                    className="text-sm font-normal text-purple-600 hover:cursor-pointer"
                  >
                    Enable reminders
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border border-purple-600 text-purple-600 hover:bg-purple-50 hover:cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 text-white hover:bg-purple-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Invoice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewInvoiceForm;