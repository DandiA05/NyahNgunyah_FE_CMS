import React from "react";
import AddPegawaiElements from "@/components/AddPegawaiElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Tambah Data Pegawai",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <AddPegawaiElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
