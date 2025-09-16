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
        
      <div className="w-full max-w-xxl mx-auto my-12 bg-[#faf6ff] rounded-3xl shadow-lg flex flex-col items-center px-6 py-10">
           
        <button
          className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-purple-200 bg-white mb-4 shadow-sm"
          onClick={() => setOpen(true)}
          aria-label="Create New Invoice"
        >
               <Plus className="w-9 h-9 text-purple-600" />   
        </button>
           
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-400 text-transparent bg-clip-text mb-2">
               Create New Invoice    
        </div>
           
        <div className="text-gray-500 text-sm text-center mb-4">
               Start by creating and sending new invoice    
        </div>
           
        <button
          className="text-xs text-purple-500 hover:underline"
          onClick={() => {
            /* handle file upload or show upload dialog */
          }}
        >
               Or Upload an existing invoice and set payment reminder   
          
        </button>
          
      </div>
        
      <Dialog open={open} onOpenChange={setOpen}>
           
        <DialogContent className="sm:max-w-[425px]">
              
          <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>     
            <DialogDescription>
                     Fill in the invoice details below. Click save when
              you&apos;re done.      
            </DialogDescription>
                
          </DialogHeader>
              
          <form onSubmit={handleSubmit}>
                 
            <div className="grid gap-4 py-4">
                    
              <div className="grid grid-cols-4 items-center gap-4">
                       
                <Label htmlFor="invoiceNumber" className="text-right">
                           Invoice #        
                </Label>
                       
                <Input
                  id="invoiceNumber"
                  value={form.invoiceNumber}
                  placeholder="INV-010"
                  className="col-span-3"
                  disabled
                  readOnly
                />
                      
              </div>
                    
              <div className="grid grid-cols-4 items-center gap-4">
                       
                <Label htmlFor="customer" className="text-right">
                 Customer 
                </Label>
                       
                <Input
                  id="customer"
                  value={form.customer}
                  onChange={(e) =>
                    handleInputChange("customer", e.target.value)
                  }
                  placeholder="Customer name"
                  className="col-span-3"
                  required
                />
                      
              </div>
                    
              <div className="grid grid-cols-4 items-center gap-4">
                       
                <Label htmlFor="amount" className="text-right">
                           Amount        
                </Label>
                       
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="0.00"
                  className="col-span-3"
                  required
                />
                      
              </div>
                    
              <div className="grid grid-cols-4 items-center gap-4">
                       
                <Label htmlFor="dueDate" className="text-right">
                           Due Date        
                </Label>
                       
                <Input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className="col-span-3"
                  required
                />
                      
              </div>
                    
              <div className="grid grid-cols-4 items-center gap-4">
                       
                <Label htmlFor="status" className="text-right">
                           Status        
                </Label>
                       
                <Select
                  value={form.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                          
                  <SelectTrigger className="col-span-3">
                             
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
                       
                <Label htmlFor="reminder" className="text-right">
                           Reminder        
                </Label>
                       
                <div className="col-span-3 flex items-center space-x-2">
                          
                  <Checkbox
                    id="reminder"
                    checked={form.reminder}
                    onCheckedChange={(checked) =>
                      handleInputChange("reminder", checked)
                    }
                  />
                          
                  <Label htmlFor="reminder" className="text-sm font-normal">
                              Enable reminder notifications     
                       
                  </Label>
                         
                </div>
                      
              </div>
                   
            </div>
                 
            <DialogFooter>
                    
              <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel       
              </Button>
                     <Button type="submit">Save Invoice</Button>    
              
            </DialogFooter>
                
          </form>
             
        </DialogContent>
          
      </Dialog>
       
    </>
  );
};

export default NewInvoiceForm;
