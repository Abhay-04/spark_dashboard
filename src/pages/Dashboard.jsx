import React from "react";

import TimeFilter from "../components/TimeFilter";
import InvoiceList from "../components/InvoicesList";
import NewInvoiceForm from "@/components/NewInvoiceForm";
import IncomeTrendChart from "@/components/IncomeTrendChart";
import PaymentDataCard from "@/components/PaymentDataCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function Dashboard() {
  return (
    <div className="p-3 container mx-auto max-w-screen-xl ">
      <Header />
      <NewInvoiceForm />
      <TimeFilter />
      <PaymentDataCard />
      <IncomeTrendChart />
      <InvoiceList />
      <Footer />
     
    </div>
  );
}
