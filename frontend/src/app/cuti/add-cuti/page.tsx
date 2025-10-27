import React from "react";
import AddCutiElements from "@/components/AddCutiElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Tambah Data Cuti",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <AddCutiElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
