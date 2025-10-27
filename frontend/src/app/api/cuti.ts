import axios from "axios";
import { Pegawai } from "./pegawai";

export type Cuti = {
  id: number;
  pegawai: Pegawai;
  pegawai_id: string; 
  alasan: string; 
  mulai_tanggal: string;
  akhir_tanggal: string;
};



export const fetchCuti = async (): Promise<Cuti[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; 

  try {
    const response = await axios.get(`${apiUrl}/cuti`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch cuti data");
    }

    console.log(response.data.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const fetchCutiById = async (id: number): Promise<Cuti[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.get(`${apiUrl}/cuti/${id}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch cuti data");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const addCuti = async (cutiData: {
  pegawai_id: string;
  alasan: string;
  mulai_tanggal: string;
  akhir_tanggal: string;
}): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.post(`${apiUrl}/cuti`, cutiData);

    if (response.status !== 201) {
      throw new Error("Failed to add cuti");
    }

    return response.data; 
  } catch (error: any) {
    throw new Error(error.message || "Error adding cuti");
  }
};

export const editCuti = async (
  id: number,
  cutiData: {
    nama_depan: string;
    nama_belakang: string;
    email: string;
    no_hp: string;
    jenis_kelamin: string;
    address: string;
  },
): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.put(`${apiUrl}/cuti/${id}`, cutiData);

    if (response.status !== 200) {
      throw new Error("Failed to edit cuti");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error editing cuti");
  }
};
export const deleteCuti = async (id: number): Promise<void> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.delete(`${apiUrl}/cuti/${id}`);

    if (response.status !== 200) {
      throw new Error("Failed to delete cuti data");
    }

    console.log(`cuti dengan ID ${id} berhasil dihapus`);
  } catch (error: any) {
    throw new Error(
      error.message || "Something went wrong while deleting cuti",
    );
  }
};
