// app/error.jsx
'use client' // Harus ada untuk menangani error di komponen client

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen items-center justify-center text-center flex-col dark:bg-boxdark-2 dark:text-bodydark">
      <h1 className="text-4xl font-bold text-red-600">500 - Terjadi Kesalahan</h1>
      <p className="text-gray-600 mt-2">Ups, terjadi kesalahan saat memuat halaman.</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Coba Lagi
      </button>
    </div>
  );
}
