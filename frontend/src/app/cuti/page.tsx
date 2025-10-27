"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TablePegawai from "@/components/Tables/TablePegawai";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import TableCuti from "@/components/Tables/TableCuti";
const CutiPages = () => {
  const router = useRouter();

  useEffect(() => {

    const accessToken = Cookies.get("access_token");
    console.log(accessToken);
    if (!accessToken) {
   
      router.push("/auth/signin");
    }
  }, [router]);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Data Cuti" />

      <div className="flex flex-col gap-10">
        <TableCuti />
      </div>
    </DefaultLayout>
  );
};

export default CutiPages;
