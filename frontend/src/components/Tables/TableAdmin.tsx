"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deletePegawai, fetchPegawai, Pegawai } from "../../app/api/pegawai";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { AdminType, deleteAdmin, fetchAdmin } from "@/app/api/admin";

const TableAdmin = () => {
  const [adminList, setAdminList] = useState<AdminType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAdmin = async (
    id: number,
    setAdminList: (pegawai: AdminType[]) => void,
  ) => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: `Data Admin ini akan dihapus dan tidak dapat dikembalikan.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });
      if (result.isConfirmed) {
        await deleteAdmin(id);
        Swal.fire("Dihapus!", `Data admin berhasil dihapus.`, "success");

        const updatedadminList = await fetchAdmin();
        setAdminList(updatedadminList);
      }
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus admin.", "error");
    }
  };

  useEffect(() => {
    const getPegawaiData = async () => {
      try {
        setLoading(true);
        const data = await fetchAdmin();
        setAdminList(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getPegawaiData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-end px-4 py-6 md:px-6 xl:px-7.5">
        <Link
          href={"/data-admin/add-admin"}
          className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
        >
          Tambah Data Admin
        </Link>
      </div>
      <div className="grid grid-cols-8 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Nama</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Email</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Tanggal Lahir</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Jenis Kelamin</p>
        </div>

        <div className="col-span-1 flex items-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {adminList.length === 0 ? (
        <div className="py-4 text-center text-sm text-black dark:text-white">
          Data admin tidak ada
        </div>
      ) : (
        adminList.map((admin, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm text-black dark:text-white">
                    {admin.firstName}
                  </span>
                  <span className="text-sm text-black dark:text-white">
                    {admin.lastName}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {admin.email}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {admin.dateOfBirth}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {admin.gender}
              </p>
            </div>

            {/* Tombol Edit dan Delete */}
            <div className="col-span-1 flex items-start justify-start gap-3">
              {/* Tombol Edit */}
              <Link
                href={`/data-admin/edit-admin/${admin.id}`}
                className="flex items-center text-blue-500 dark:text-blue-400"
              >
                Edit
              </Link>

              {/* Tombol Delete */}
              <button
                className="flex items-center text-red-500 dark:text-red-400"
                onClick={() => handleDeleteAdmin(admin.id, setAdminList)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TableAdmin;
