import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AddProdukElements from "@/components/AddProdukElements";

export const metadata: Metadata = {
  title: "Tambah Data Produk",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <AddProdukElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
