"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  editPegawai,
  addPegawai,
  Pegawai,
  fetchPegawaiById,
} from "@/app/api/pegawai";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import Swal from "sweetalert2";

const validationSchema = z.object({
  namaDepan: z.string().min(1, { message: "Nama depan is required" }),
  namaBelakang: z.string().min(1, { message: "Nama belakang is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  noHp: z.string().min(1, { message: "No HP is required" }),
  jenisKelamin: z.string().min(1, { message: "Jenis kelamin is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});

type FormData = {
  namaDepan: string;
  namaBelakang: string;
  email: string;
  noHp: string;
  jenisKelamin: string;
  address: string;
};

const EditPegawaiElements = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
  });
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataPegawai, setDataPegawai] = useState<any>(null);

  useEffect(() => {
    fetchDataById(Number(id));
  }, [id]);

  useEffect(() => {
    console.log("Fetched data:", dataPegawai); 
  }, [dataPegawai]);

  useEffect(() => {
    if (dataPegawai) {
      setValue("namaDepan", dataPegawai.nama_depan); 
      setValue("namaBelakang", dataPegawai.nama_belakang);
      setValue("email", dataPegawai.email);
      setValue("noHp", dataPegawai.no_hp);
      setValue("jenisKelamin", dataPegawai.jenis_kelamin);
      setValue("address", dataPegawai.address); 
    }
  }, [dataPegawai, setValue]);
  const fetchDataById = async (id: number) => {
    try {
      setLoading(true);
      const data = await fetchPegawaiById(id);
      setDataPegawai(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pegawai data");
      console.error("Error fetching data by ID:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true); // Menampilkan loading sebelum proses pengiriman data
    setError(""); // Reset error sebelum proses pengiriman data

    // Menampilkan pertanyaan konfirmasi sebelum mengirimkan data
    const confirmation = await Swal.fire({
      title: "Pastikan Data Sudah Benar",
      text: "Apakah Anda yakin ingin memperbarui data pegawai ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Perbarui!",
      cancelButtonText: "Batal",
    });

    // Jika pengguna mengklik "Ya, Perbarui!"
    if (confirmation.isConfirmed) {
      try {
        // Panggil fungsi editPegawai untuk mengirimkan data ke API
        const result = await editPegawai(Number(id), {
          nama_depan: data.namaDepan,
          nama_belakang: data.namaBelakang,
          email: data.email,
          no_hp: data.noHp,
          jenis_kelamin: data.jenisKelamin,
          address: data.address,
        });

        // Menampilkan SweetAlert jika berhasil
        Swal.fire({
          title: "Success!",
          text: "Data pegawai berhasil diperbarui.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Lakukan redirect setelah alert ditutup
          router.push("/pegawai"); // Arahkan ke halaman pegawai
        });
      } catch (err: any) {
        setError("Failed to edit pegawai");
        console.error("Error:", err.message || err); // Log error jika ada masalah
        // Tampilkan error jika gagal
        Swal.fire({
          title: "Error",
          text: err.message || "Terjadi kesalahan saat memperbarui pegawai.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false); // Menyembunyikan loading setelah proses selesai
      }
    } else {
      setLoading(false); // Menyembunyikan loading jika dibatalkan
    }
  };

  return (
    <>
      <Breadcrumb pageName="Edit Data Pegawai" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* Input Fields */}

          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col gap-5.5 p-6.5">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Nama Depan
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Depan"
                    {...register("namaDepan")}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.namaDepan && (
                    <span className="text-red-500">
                      {errors.namaDepan.message}
                    </span>
                  )}
                </div>

                <div className="my-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Nama Belakang
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Belakang"
                    {...register("namaBelakang")}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.namaBelakang && (
                    <span className="text-red-500">
                      {errors.namaBelakang.message}
                    </span>
                  )}
                </div>

                <div className="my-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                  )}
                </div>

                <div className="my-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    No Hp
                  </label>
                  <input
                    type="text"
                    placeholder="No Hp"
                    {...register("noHp")}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.noHp && (
                    <span className="text-red-500">{errors.noHp.message}</span>
                  )}
                </div>

                {/* Jenis Kelamin */}
                <div className="my-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Jenis Kelamin
                  </label>
                  <div className="flex items-center space-x-8">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="Male"
                        {...register("jenisKelamin")}
                        className="h-6 w-6 text-primary focus:ring-2 focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:ring-offset-0"
                      />
                      <span className="text-sm text-black dark:text-white">
                        Male
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="Female"
                        {...register("jenisKelamin")}
                        className="h-6 w-6 text-primary focus:ring-2 focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:ring-offset-0"
                      />
                      <span className="text-sm text-black dark:text-white">
                        Female
                      </span>
                    </label>
                  </div>
                  {errors.jenisKelamin && (
                    <span className="mt-1 text-sm text-red-500">
                      {errors.jenisKelamin.message}
                    </span>
                  )}
                </div>
                <div className="my-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Alamat
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Alamat"
                    {...register("address")}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.address && (
                    <span className="text-red-500">
                      {errors.address.message}
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-2.5">
                  <Link
                    href="/pegawai"
                    className="flex items-center justify-center gap-3.5 rounded-lg bg-gray-500 px-10 py-4 text-sm font-medium text-white transition-colors hover:bg-gray-600"
                  >
                    Batal
                  </Link>

                  <button
                    type="submit"
                    className="hover:bg-primary-dark flex items-center justify-center gap-3.5 rounded-lg bg-primary px-10 py-4 text-sm font-medium text-white transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPegawaiElements;
