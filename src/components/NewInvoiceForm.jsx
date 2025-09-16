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
  const dispatch = useDispatch();
  const form = useSelector((state) => state.invoices.form);
  const invoices = useSelector((state) => state.invoices.invoices); // Generate next invoice number

  const generateInvoiceNumber = () => {
    const existingNumbers = invoices
      .map((inv) => inv.invoiceNumber)
      .filter((num) => num.startsWith("INV-"))
      .map((num) => parseInt(num.replace("INV-", ""), 10))
      .filter((num) => !isNaN(num));
    const maxNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) : 8;
    const nextNumber = maxNumber + 1;
    return `INV-${nextNumber.toString().padStart(3, "0")}`;
  }; // Set invoice number when dialog opens

  useEffect(() => {
    if (open && !form.invoiceNumber) {
      const newInvoiceNumber = generateInvoiceNumber();
      dispatch(setForm({ invoiceNumber: newInvoiceNumber }));
    }
  }, [open, form.invoiceNumber, dispatch]);

  const handleInputChange = (field, value) => {
    dispatch(setForm({ [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.invoiceNumber ||
      !form.customer ||
      !form.amount ||
      !form.dueDate
    ) {
      alert("Please fill in all required fields");
      return;
    }
    dispatch(
      addInvoice({
        invoiceNumber: form.invoiceNumber,
        customer: form.customer,
        amount: parseFloat(form.amount),
        dueDate: form.dueDate,
        status: form.status,
        reminder: form.reminder,
        createdAt: new Date().toISOString(),
      })
    );
    dispatch(resetForm());
    setOpen(false);
  };

  const handleCancel = () => {
    dispatch(resetForm());
    setOpen(false);
  };
  // --- CARD UI -------

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="w-full lg:w-full  max-w-xxl mx-auto mt-8 mb-6 bg-[#F2F2F2] rounded-3xl shadow-lg flex flex-col items-center px-6 py-10 hover:cursor-pointer"
      >
        <button
          className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-purple-200 bg-white mb-4 shadow-sm "
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

        <div className="text-[#999999] text-xs  text-center mb-4">
          Start by creating and sending new invoice
        </div>

        

      </div>
       <div className=" text-center">
        <button className="text-xs text-[#8134AF]  over:underline mx-auto">
          Or Upload an existing invoice and set payment reminder
        </button>
       </div>
       

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-md shadow-lg border border-purple-300">
          <DialogHeader>
            <DialogTitle className="text-purple-700 font-semibold ">
              Create New Invoice
            </DialogTitle>
            <DialogDescription>
              Fill in the invoice details below. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

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
                  value={form.invoiceNumber}
                  placeholder="INV-010"
                  className="col-span-3 border border-purple-400 focus:border-purple-600 focus:ring focus:ring-purple-300 rounded-md "
                  disabled
                  readOnly
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="customer"
                  className="text-right text-purple-700 font-medium"
                >
                  Customer
                </Label>
                <Input
                  id="customer"
                  value={form.customer}
                  onChange={(e) =>
                    handleInputChange("customer", e.target.value)
                  }
                  placeholder="Customer name"
                  className="col-span-3 border border-purple-400 focus:border-purple-600 focus:ring focus:ring-purple-300 rounded-md hover:cursor-pointer"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="amount"
                  className="text-right text-purple-700 font-medium "
                >
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={form.amount}
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
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className="col-span-3 border border-purple-400 focus:border-purple-600 focus:ring focus:ring-purple-300 rounded-md hover:cursor-pointer"
                  required
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
                  value={form.status}
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
                    checked={form.reminder}
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 text-white hover:bg-purple-700 hover:cursor-pointer"
              >
                Save Invoice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewInvoiceForm;
