import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableProduk from "@/components/Tables/TableProduk";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product",
};

const ProductPages = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Data Produk" />
      <div className="flex flex-col gap-10">
        <TableProduk />
      </div>
    </DefaultLayout>
  );
};

export default ProductPages;
