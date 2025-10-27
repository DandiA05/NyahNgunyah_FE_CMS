import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <h1>Home</h1>
      </DefaultLayout>
    </>
  );
}
