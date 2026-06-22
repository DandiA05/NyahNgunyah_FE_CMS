import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TablePegawai from "@/components/Tables/TablePegawai";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Pegawai",
};

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
