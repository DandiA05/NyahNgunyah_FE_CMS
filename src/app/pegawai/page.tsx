"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TablePegawai from "@/components/Tables/TablePegawai";
import DefaultLayout from "@/components/Layouts/DefaultLayout";



const PegawaiPages = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Data Pegawai" />
      <div className="flex flex-col gap-10">
        <TablePegawai />
      </div>
    </DefaultLayout>
  );
};

export default PegawaiPages;
