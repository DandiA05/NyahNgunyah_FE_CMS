"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteCuti, fetchCuti, Cuti } from "../../../src/app/api/cuti";
import Swal from "sweetalert2";

const TableCuti = () => {
  const [cutiList, setCutiList] = useState<Cuti[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteCuti = async (
    id: number,
    setCutiList: (cuti: Cuti[]) => void,
  ) => {
    try {
      // Tampilkan SweetAlert2 untuk konfirmasi
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: `Data cuti ini akan dihapus dan tidak dapat dikembalikan.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      // Jika pengguna menekan tombol "Ya, hapus!"
      if (result.isConfirmed) {
        await deleteCuti(id);
        Swal.fire("Dihapus!", `Data cuti berhasil dihapus.`, "success");

        // Fetch data cuti lagi setelah penghapusan berhasil
        const updateCutiList = await fetchCuti();
        setCutiList(updateCutiList); // Update state daftar cuti
      }
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus cuti.", "error");
    }
  };

  useEffect(() => {
    const getCutiData = async () => {
      try {
        setLoading(true);
        const data = await fetchCuti();
        console.log(`ehe`, data);
        setCutiList(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getCutiData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-end px-4 py-6 md:px-6 xl:px-7.5">
        <Link
          href={"/cuti/add-cuti"}
          className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
        >
          Tambah Data Cuti Pegawai
        </Link>
      </div>
      <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Nama Pegawai</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Alasan Cuti</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Tanggal Mulai</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Tanggal Berakhir</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {cutiList?.length === 0 ? (
        <div className="py-4 text-center text-sm text-black dark:text-white">
          Data cuti tidak ada
        </div>
      ) : (
        cutiList?.map((cuti, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm text-black dark:text-white">
                    {cuti.pegawai.nama_depan}
                  </span>
                  <span className="text-sm text-black dark:text-white">
                    {cuti.pegawai.nama_belakang}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {cuti.alasan}
              </p>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {cuti.mulai_tanggal}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {cuti.akhir_tanggal}
              </p>
            </div>

            <div className="col-span-1 flex items-start justify-start gap-3">
              <button
                className="flex items-center text-red-500 dark:text-red-400"
                onClick={() => handleDeleteCuti(cuti.id, setCutiList)}
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

export default TableCuti;
