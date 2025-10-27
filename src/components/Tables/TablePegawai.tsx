"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deletePegawai,
  fetchPegawai,
  Pegawai,
} from "../../../src/app/api/pegawai";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const TablePegawai = () => {
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDeletePegawai = async (
    id: number,
    setPegawaiList: (pegawai: Pegawai[]) => void,
  ) => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: `Data pegawai ini akan dihapus dan tidak dapat dikembalikan.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });
      if (result.isConfirmed) {
        await deletePegawai(id);
        Swal.fire("Dihapus!", `Data pegawai berhasil dihapus.`, "success");

        const updatedPegawaiList = await fetchPegawai();
        setPegawaiList(updatedPegawaiList);
      }
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus pegawai.", "error");
    }
  };

  useEffect(() => {
    const getPegawaiData = async () => {
      try {
        setLoading(true);
        const data = await fetchPegawai();
        setPegawaiList(data);
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
          href={"/pegawai/add-pegawai"}
          className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
        >
          Tambah Data Pegawai
        </Link>
      </div>
      <div className="grid grid-cols-8 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Nama</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Email</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">No Hp</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Jenis Kelamin</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Alamat</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Sisa Cuti</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {pegawaiList.length === 0 ? (
        <div className="py-4 text-center text-sm text-black dark:text-white">
          Data pegawai tidak ada
        </div>
      ) : (
        pegawaiList.map((pegawai, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-1 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm text-black dark:text-white">
                    {pegawai.nama_depan}
                  </span>
                  <span className="text-sm text-black dark:text-white">
                    {pegawai.nama_belakang}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {pegawai.email}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {pegawai.no_hp}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {pegawai.jenis_kelamin}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {pegawai.address}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {pegawai.sisa_cuti}
              </p>
            </div>
            {/* Tombol Edit dan Delete */}
            <div className="col-span-1 flex items-start justify-start gap-3">
              {/* Tombol Edit */}
              <Link
                href={`/pegawai/edit-pegawai/${pegawai.id}`}
                className="flex items-center text-blue-500 dark:text-blue-400"
              >
                Edit
              </Link>

              {/* Tombol Delete */}
              <button
                className="flex items-center text-red-500 dark:text-red-400"
                onClick={() => handleDeletePegawai(pegawai.id, setPegawaiList)} 
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

export default TablePegawai;
