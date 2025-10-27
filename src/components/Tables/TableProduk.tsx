"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteProduk, fetchProduk, Produk } from "../../app/api/produk";
import Swal from "sweetalert2";
import Image from "next/image";

const TableProduk = () => {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatHarga = (harga: number) => {
    if (isNaN(harga)) return "Rp 0"; // Validasi jika harga bukan angka
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Tidak ada pecahan desimal
    }).format(harga);
  };

  const handleDeleteProduk = async (
    id: number,
    setProdukList: (produk: Produk[]) => void,
  ) => {
    try {
      // Tampilkan SweetAlert2 untuk konfirmasi
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: `Data produk ini akan dihapus dan tidak dapat dikembalikan.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      // Jika pengguna menekan tombol "Ya, hapus!"
      if (result.isConfirmed) {
        await deleteProduk(id);
        Swal.fire("Dihapus!", `Data produk berhasil dihapus.`, "success");

        // Fetch data produk lagi setelah penghapusan berhasil
        const updateProdukList = await fetchProduk();
        setProdukList(updateProdukList); // Update state daftar produk
      }
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus produk.", "error");
    }
  };

  useEffect(() => {
    const getProdukData = async () => {
      try {
        setLoading(true);
        const data = await fetchProduk();
        console.log("data produk: ", data);
        setProdukList(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getProdukData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-end px-4 py-6 md:px-6 xl:px-7.5">
        <Link
          href={"/produk/add-produk"}
          className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
        >
          Tambah Data Produk
        </Link>
      </div>
      <div className="grid grid-cols-12 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-12 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Nama Produk</p>
        </div>
        <div className="col-span-4 hidden items-center justify-center sm:flex">
          <p className="font-medium">Foto Produk</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Stock</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Harga</p>
        </div>

        <div className="col-span-1 flex items-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {produkList?.length === 0 ? (
        <div className="py-4 text-center text-sm text-black dark:text-white">
          Data produk tidak ada
        </div>
      ) : (
        produkList?.map((produk, key) => (
          <div
            className="grid grid-cols-12 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-12 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm text-black dark:text-white">
                    {produk.nama}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-4 flex items-center justify-center">
              {produk.fotos.length > 0 && (
                <Image
                  width={100}
                  height={100}
                  src={
                    produk.fotos[0].foto.startsWith("http")
                      ? produk.fotos[0].foto
                      : `http://${produk.fotos[0].foto}`
                  }
                  alt={produk.fotos[0].id}
                  className="h-40 w-40 object-cover"
                />
              )}
            </div>

            <div className="col-span-2 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {produk.stock}
              </p>
            </div>

            <div className="col-span-2 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {formatHarga(Number(produk.harga))}
              </p>
            </div>
            <div className="col-span-1 flex items-center justify-start gap-3">
              <Link
                href={`/produk/edit-produk/${produk.id}`}
                className="flex items-center text-blue-500 dark:text-blue-400"
              >
                Edit
              </Link>
              <button
                className="flex items-center text-red-500 dark:text-red-400"
                onClick={() => handleDeleteProduk(produk.id, setProdukList)}
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

export default TableProduk;
