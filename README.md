# 🧾 Invoice Management App  

A fully dynamic invoice management web application built with **React**, **Redux Toolkit**, and **Shadcn UI**.  
It allows you to **create, manage, and filter invoices** with persistent data storage.  

---

## 🚀 Features  

- ✅ **Create New Invoices** – Dynamically generate invoice numbers.  
- ✅ **Persistent Storage** – Invoices saved via Redux Toolkit + localStorage.  
- ✅ **Filter Invoices** – View invoices by 3 months, 1 year, or custom date range.  
- ✅ **Responsive UI** – Built with **Shadcn UI components**.  
- ✅ **Dynamic Dialog** – Create invoice modal using Shadcn dialog & form components.  
- ✅ **Customizable Invoice Status** – Paid / Unpaid / Awaited / Overdue.  
- ✅ **Reminder Option** – Optional reminders toggle.  

---

## 🛠️ Tech Stack  

- **React** – Frontend library  
- **Redux Toolkit** – State management with slices  
- **Shadcn UI** – UI components  
- **Lucide React** – Icons  
- **Vite / CRA** – (depending on your setup) for dev environment  

---



## 📝 Approach  

- **State Management with Redux Toolkit**  
  - Used a slice (`invoiceSlice.js`) to handle invoices and form state.  
  - Persisted data to localStorage for a seamless experience.  

- **Dynamic Invoice Numbers**  
  - Auto-generates the next invoice number based on the existing invoices list.  

- **Reusable Components**  
  - Created a `NewInvoiceForm` component with Shadcn dialog and inputs.  
  - Used the same component to handle form state and validation dynamically.  

- **Responsive Design**  
  - Followed a clean, minimal UI approach using Shadcn UI components.  
  - Ensured the app works across desktop and mobile.  

- **Filtering Logic**  
  - Implemented date filters (3 months, 1 year, or custom date range) using simple JavaScript date checks.  

---

## 📦 Installation  

```bash
# Clone the repository
git clone https://github.com/Abhay-04/spark_dashboard

# Navigate to project directory
cd invoice-management-app

# Install dependencies
npm install

# Start development server
npm run dev


## 🙏 Thank You

## Thank you for checking out this project. Looking forward to your feedback!