import React from "react";
import EditAdminElements from "@/components/EditAdminElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Edit Data Pegawai",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <EditAdminElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
