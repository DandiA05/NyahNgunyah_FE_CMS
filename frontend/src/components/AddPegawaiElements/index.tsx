"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectGroupTwo from "@/components/SelectGroup/JenisKelaminSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { addPegawai } from "@/app/api/pegawai";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

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

const AddPegawaiElements = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
  });
  const [successMessage, setSuccessMessage] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(""); 

    const confirmation = await Swal.fire({
      title: "Pastikan Data Sudah Benar",
      text: "Apakah Anda yakin ingin mengirimkan data pegawai ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim!",
      cancelButtonText: "Batal",
    });

    if (confirmation.isConfirmed) {
      try {
        const result = await addPegawai({
          nama_depan: data.namaDepan,
          nama_belakang: data.namaBelakang,
          email: data.email,
          no_hp: data.noHp,
          jenis_kelamin: data.jenisKelamin,
          address: data.address,
        });

        Swal.fire({
          title: "Success!",
          text: "Data pegawai berhasil ditambahkan.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/pegawai");
        });
      } catch (err: any) {
        setError("Failed to add pegawai");
        console.error("Error:", err.message || err); 
        Swal.fire({
          title: "Error",
          text: err.message || "Terjadi kesalahan saat menambahkan pegawai.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false); 
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Tambah Data Pegawai" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">

          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {successMessage && (
              <div className="flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
                <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                      fill="white"
                      stroke="white"
                    ></path>
                  </svg>
                </div>
                <div className="w-full">
                  <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399] ">
                    Message Sent Successfully
                  </h5>
                  <p className="text-base leading-relaxed text-body">
                    Data pegawai berhasil ditambahkan.
                  </p>
                </div>
              </div>
            )}
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

                <div className="my-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Jenis Kelamin
                  </label>
                  <div className="flex items-center space-x-8">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="male"
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
                        value="female"
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

export default AddPegawaiElements;
