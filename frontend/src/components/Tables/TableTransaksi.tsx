"use client";

import { useEffect, useState } from "react";
import { fetchTransaksi, Transaksi } from "../../app/api/transaksi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, set } from "date-fns";

import Link from "next/link";
import moment from "moment";
import { formatHarga, getStatusColor, getStatusLabel } from "@/helper";

const TableTransaksi = () => {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // state untuk filter
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<any>("pending");
  const [startDate, setStartDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState(
    moment().endOf("month").format("YYYY-MM-DD"),
  );

  const getTransaksiData = async () => {
    try {
      setLoading(true);
      const data = await fetchTransaksi({
        search,
        status,
        startDate,
        endDate,
      });
      setTransaksiList(data);
    } catch (err: any) {
      setTransaksiList([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransaksiData();
  }, []);

  // fungsi filter
  const handleFilter = () => {
    getTransaksiData();
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    getTransaksiData();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {/* 🔍 Filter Section */}
      <div className="mb-4 flex flex-col gap-3 rounded-md border border-stroke bg-white p-4 shadow dark:border-strokedark dark:bg-boxdark md:flex-row md:items-end md:gap-4">
        {/* Search */}
        <div className="flex flex-1 flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama / nomor transaksi..."
            className="rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-boxdark dark:text-white"
          />
        </div>
        {/* Status */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-boxdark dark:text-white"
          >
            <option value="">Semua</option>
            <option value="pending">Menunggu Konfirmasi</option>
            <option value="process">Sedang Diproses</option>
            <option value="deliver">Sedang Dikirim</option>
            <option value="cancelled">Dibatalkan</option>
            <option value="completed">Selesai</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <DatePicker
            selected={startDate ? new Date(startDate) : null}
            onChange={(date: Date | null) => {
              if (date) setStartDate(format(date, "yyyy-MM-dd"));
              else setStartDate("");
            }}
            dateFormat="dd-MM-yyyy"
            className="rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-boxdark dark:text-white"
            placeholderText="Pilih tanggal mulai"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <DatePicker
            selected={endDate ? new Date(endDate) : null}
            onChange={(date: Date | null) => {
              if (date) setEndDate(format(date, "yyyy-MM-dd"));
              else setEndDate("");
            }}
            dateFormat="dd-MM-yyyy"
            className="rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-boxdark dark:text-white"
            placeholderText="Pilih tanggal akhir"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Filter
          </button>
          <button
            onClick={handleReset}
            className="rounded-md bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-white"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 📊 Summary Cards */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Total Transaksi */}
        <div className="flex items-center justify-between rounded-md border border-stroke bg-white p-4 shadow dark:border-strokedark dark:bg-boxdark">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Transaksi (berdasarkan filter)
            </p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {transaksiList.length} 
            </p>
          </div>
        </div>

        {/* Total Pendapatan */}
        <div className="flex items-center justify-between rounded-md border border-stroke bg-white p-4 shadow dark:border-strokedark dark:bg-boxdark">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Pendapatan (berdasarkan filter)
            </p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {formatHarga(
                transaksiList.reduce(
                  (sum, t) => sum + Number(t.total_harga),
                  0,
                ),
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 🧾 Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Header */}
        <div className="grid grid-cols-12 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">Nomor Transaksi</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Tanggal Transaksi</p>
          </div>
          <div className="col-span-3 flex items-center">
            <p className="font-medium">Nama Pembeli</p>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <p className="font-medium">Status</p>
          </div>
          <div className="col-span-2 flex items-center justify-end">
            <p className="font-medium">Total Harga</p>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <p className="font-medium">Action</p>
          </div>
        </div>

        {/* Body */}
        {transaksiList.length === 0 ? (
          <div className="py-4 text-center text-sm text-black dark:text-white">
            Data transaksi tidak ada
          </div>
        ) : (
          transaksiList.map((transaksi, key) => (
            <div
              key={key}
              className="grid grid-cols-12 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
            >
              <div className="col-span-2 hidden items-center sm:flex">
                <span className="rounded px-2 py-1 text-sm text-black dark:text-white">
                  {transaksi.nomor_transaksi}
                </span>
              </div>

              <div className="col-span-2 flex items-center">
                <span className="text-sm text-black dark:text-white">
                  {moment(transaksi.tanggal).format("DD MMMM YYYY, HH:mm")}
                </span>
              </div>

              <div className="col-span-3 flex items-center">
                <span className="text-sm text-black dark:text-white">
                  {transaksi.nama_pembeli}
                </span>
              </div>

              <div className="col-span-2 flex items-center justify-center">
                <span
                  className={`rounded-full px-3 py-1 text-center text-xs font-semibold ${getStatusColor(
                    transaksi.status ?? "Unknown",
                  )}`}
                >
                  {getStatusLabel(transaksi.status ?? "unknown")}
                </span>
              </div>

              <div className="col-span-2 flex items-center justify-end">
                <span className="text-sm text-black dark:text-white">
                  {formatHarga(Number(transaksi.total_harga))}
                </span>
              </div>

              <div className="col-span-1 flex items-center justify-center">
                <Link
                  href={`/transaksi/detail-transaksi/${transaksi.id}`}
                  className="flex items-center text-blue-500 dark:text-blue-400"
                >
                  Detail
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default TableTransaksi;
