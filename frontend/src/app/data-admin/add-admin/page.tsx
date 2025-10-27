import React from "react";
import AddAdminElements from "@/components/AddAdminElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Tambah Data Admin",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <AddAdminElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
