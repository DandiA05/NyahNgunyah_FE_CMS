import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditProdukElements from "@/components/EditProdukElements";

export const metadata: Metadata = {
  title: "Edit Data Produk",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <EditProdukElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
