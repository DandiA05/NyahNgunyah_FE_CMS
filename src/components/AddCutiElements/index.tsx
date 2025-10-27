"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NamaPegawaiSelect from "@/components/SelectGroup/NamaPegawaiSelect";
import Link from "next/link";
import * as z from "zod";

import { useEffect, useState } from "react";
import { fetchPegawai, Pegawai } from "@/app/api/pegawai";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { addCuti } from "@/app/api/cuti";

const validationSchema = z.object({
  namaPegawai: z.string().min(1, { message: "Nama Pegawai is required" }), 
  alasan: z.string().min(1, { message: "Alasan is required" }),
  tanggalMulai: z.string().min(1, { message: "Tanggal Mulai is required" }),
  tanggalAkhir: z.string().min(1, { message: "Tanggal Akhir is required" }),
});

type FormData = {
  namaPegawai: string;
  alasan: string;
  tanggalMulai: string;
  tanggalAkhir: string;
};

const AddCutiElements = () => {
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
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    flatpickr(".form-datepicker", {
      dateFormat: "m/d/Y", 
    });
  }, []);



  const onSubmit = async (data: FormData) => {
    setLoading(true); 
    setError(""); 

  
    const formatDate = (date: string): string => {
      const [month, day, year] = date.split("/");
      const formattedDate = new Date(`${year}-${month}-${day}`);
      return formattedDate.toISOString().split("T")[0]; 
    };

    const confirmation = await Swal.fire({
      title: "Pastikan Data Sudah Benar",
      text: "Apakah Anda yakin ingin memasukkan data cuti ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim!",
      cancelButtonText: "Batal",
    });

    if (confirmation.isConfirmed) {
      try {
        const formattedMulaiTanggal = formatDate(data.tanggalMulai);
        const formattedAkhirTanggal = formatDate(data.tanggalAkhir);

        const result = await addCuti({
          pegawai_id: String(data.namaPegawai),
          alasan: data.alasan,
          mulai_tanggal: formattedMulaiTanggal,
          akhir_tanggal: formattedAkhirTanggal,
        });

        Swal.fire({
          title: "Success!",
          text: "Data Cuti berhasil ditambahkan.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/cuti"); 
        });
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Gagal menambahkan data cuti.";
        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
        reset();
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false); 
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

  return (
    <>
      <Breadcrumb pageName="Tambah Data Cuti" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Input Fields --> */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex flex-col gap-5.5 p-6.5">
                <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                  Nama Pegawai
                </label>
                <div>
                  <div>
                    <select
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      {...register("namaPegawai")}
                    >
                      <option value="">Pilih Nama Pegawai</option>
                      {pegawaiList.map((pegawai) => (
                        <option key={pegawai.id} value={Number(pegawai.id)}>
                          {pegawai.nama_depan} {pegawai.nama_belakang}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.namaPegawai && (
                    <span className="text-red-500">
                      {errors.namaPegawai.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Tanggal Mulai Cuti
                  </label>
                </div>
                <div className="relative">
                  <input
                    {...register("tanggalMulai")}
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="mm/dd/yyyy"
                    type="text" 
                  />

                  <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.7504 2.9812H14.2879V2.36245C14.2879 2.02495 14.0066 1.71558 13.641 1.71558C13.2754 1.71558 12.9941 1.99683 12.9941 2.36245V2.9812H4.97852V2.36245C4.97852 2.02495 4.69727 1.71558 4.33164 1.71558C3.96602 1.71558 3.68477 1.99683 3.68477 2.36245V2.9812H2.25039C1.29414 2.9812 0.478516 3.7687 0.478516 4.75308V14.5406C0.478516 15.4968 1.26602 16.3125 2.25039 16.3125H15.7504C16.7066 16.3125 17.5223 15.525 17.5223 14.5406V4.72495C17.5223 3.7687 16.7066 2.9812 15.7504 2.9812ZM1.77227 8.21245H4.16289V10.9968H1.77227V8.21245ZM5.42852 8.21245H8.38164V10.9968H5.42852V8.21245ZM8.38164 12.2625V15.0187H5.42852V12.2625H8.38164V12.2625ZM9.64727 12.2625H12.6004V15.0187H9.64727V12.2625ZM9.64727 10.9968V8.21245H12.6004V10.9968H9.64727ZM13.8379 8.21245H16.2285V10.9968H13.8379V8.21245ZM2.25039 4.24683H3.71289V4.83745C3.71289 5.17495 3.99414 5.48433 4.35977 5.48433C4.72539 5.48433 5.00664 5.20308 5.00664 4.83745V4.24683H13.0504V4.83745C13.0504 5.17495 13.3316 5.48433 13.6973 5.48433C14.0629 5.48433 14.3441 5.20308 14.3441 4.83745V4.24683H15.7504C16.0316 4.24683 16.2566 4.47183 16.2566 4.75308V6.94683H1.77227V4.75308C1.77227 4.47183 1.96914 4.24683 2.25039 4.24683ZM1.77227 14.5125V12.2343H4.16289V14.9906H2.25039C1.96914 15.0187 1.77227 14.7937 1.77227 14.5125ZM15.7504 15.0187H13.8379V12.2625H16.2285V14.5406C16.2566 14.7937 16.0316 15.0187 15.7504 15.0187Z"
                        fill="#64748B"
                      />
                    </svg>
                  </div>
                  {errors.tanggalMulai && (
                    <span className="text-red-500">
                      {errors.tanggalMulai.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Tanggal Akhir Cuti
                  </label>
                </div>
                <div className="relative">
                  <input
                    {...register("tanggalAkhir")}
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="mm/dd/yyyy"
                    type="text"
                  />

                  <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.7504 2.9812H14.2879V2.36245C14.2879 2.02495 14.0066 1.71558 13.641 1.71558C13.2754 1.71558 12.9941 1.99683 12.9941 2.36245V2.9812H4.97852V2.36245C4.97852 2.02495 4.69727 1.71558 4.33164 1.71558C3.96602 1.71558 3.68477 1.99683 3.68477 2.36245V2.9812H2.25039C1.29414 2.9812 0.478516 3.7687 0.478516 4.75308V14.5406C0.478516 15.4968 1.26602 16.3125 2.25039 16.3125H15.7504C16.7066 16.3125 17.5223 15.525 17.5223 14.5406V4.72495C17.5223 3.7687 16.7066 2.9812 15.7504 2.9812ZM1.77227 8.21245H4.16289V10.9968H1.77227V8.21245ZM5.42852 8.21245H8.38164V10.9968H5.42852V8.21245ZM8.38164 12.2625V15.0187H5.42852V12.2625H8.38164V12.2625ZM9.64727 12.2625H12.6004V15.0187H9.64727V12.2625ZM9.64727 10.9968V8.21245H12.6004V10.9968H9.64727ZM13.8379 8.21245H16.2285V10.9968H13.8379V8.21245ZM2.25039 4.24683H3.71289V4.83745C3.71289 5.17495 3.99414 5.48433 4.35977 5.48433C4.72539 5.48433 5.00664 5.20308 5.00664 4.83745V4.24683H13.0504V4.83745C13.0504 5.17495 13.3316 5.48433 13.6973 5.48433C14.0629 5.48433 14.3441 5.20308 14.3441 4.83745V4.24683H15.7504C16.0316 4.24683 16.2566 4.47183 16.2566 4.75308V6.94683H1.77227V4.75308C1.77227 4.47183 1.96914 4.24683 2.25039 4.24683ZM1.77227 14.5125V12.2343H4.16289V14.9906H2.25039C1.96914 15.0187 1.77227 14.7937 1.77227 14.5125ZM15.7504 15.0187H13.8379V12.2625H16.2285V14.5406C16.2566 14.7937 16.0316 15.0187 15.7504 15.0187Z"
                        fill="#64748B"
                      />
                    </svg>
                  </div>
                  {errors.tanggalAkhir && (
                    <span className="text-red-500">
                      {errors.tanggalAkhir.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Alasan Cuti
                  </label>
                  <textarea
                    rows={6}
                    {...register("alasan")}
                    placeholder="Alasan Cuti"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                  {errors.alasan && (
                    <span className="text-red-500">
                      {errors.alasan.message}
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-2.5">
                  <Link
                    href="/cuti"
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCutiElements;
