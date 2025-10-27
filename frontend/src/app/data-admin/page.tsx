import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableAdmin from "@/components/Tables/TableAdmin";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "User Admin",
};

const DataAdminPages = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Data Admin" />
      <div className="flex flex-col gap-10">
        <TableAdmin />
      </div>
    </DefaultLayout>
  );
};

export default DataAdminPages;
