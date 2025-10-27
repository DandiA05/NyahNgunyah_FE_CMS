import { Pegawai } from "@/app/api/pegawai";
import React from "react";

// Sesuaikan tipe props dengan `Pegawai[]` yang ada di parent
interface NamaPegawaiSelectProps {
  selectedOption: string;
  setSelectedOption: (selectedId: string) => void;
  pegawaiList: Pegawai[]; // Pastikan tipe data ini sesuai dengan yang digunakan di parent
}

const NamaPegawaiSelect: React.FC<NamaPegawaiSelectProps> = ({
  selectedOption,
  setSelectedOption,
  pegawaiList,
}) => {
  return (
    <div className="relative z-20 bg-white dark:bg-form-input">
      <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)} // Memanggil fungsi dari parent
        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-3 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
      >
        <option value="" disabled className="text-body dark:text-bodydark">
          Pilih
        </option>

        {/* Menampilkan daftar pegawai */}
        {pegawaiList.map((pegawai) => (
          <option
            key={pegawai.id}
            value={pegawai.id}
            className="text-body dark:text-bodydark"
          >
            {pegawai.nama_depan} {pegawai.nama_belakang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NamaPegawaiSelect;
