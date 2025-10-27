import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableTransaksi from "@/components/Tables/TableTransaksi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaksi",
};

const TransaksiPages = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Data Transaksi" />
      <div className="flex flex-col gap-4">
        <TableTransaksi />
      </div>
    </DefaultLayout>
  );
};

export default TransaksiPages;
