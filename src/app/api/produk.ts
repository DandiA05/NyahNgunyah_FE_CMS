import axios from "axios";
import { Pegawai } from "./pegawai";

export type Produk = {
  id: number;
  nama: string;
  stock: number;
  harga: string;
  foto: string;
  fotos: any[];
};

export const fetchProduk = async (): Promise<Produk[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.get(`${apiUrl}/produk`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch produk data");
    }

    console.log(response.data.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const fetchProdukById = async (id: number): Promise<Produk[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.get(`${apiUrl}/produk/${id}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch produk data");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const addProduk = async (produkData: {
  nama: string;
  stock: number;
  harga: number;
  desc: string;
  fotos: { url: string; publicId: string }[] | null;
}): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.post(`${apiUrl}/produk`, {
      nama: produkData.nama,
      harga: produkData.harga.toString(),
      stock: produkData.stock,
      desc: produkData.desc,
      fotos: produkData.fotos,
    });

    if (response.status !== 201) {
      throw new Error("Failed to add produk");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error adding produk");
  }
};

export const editProduk = async (
  id: number,
  produkData: {
    nama: string;
    stock: number;
    harga: string;
    desc: string;
    fotos?: { url: string; publicId: string }[] | null;
    existingFileIds: number[];
  },
): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.put(`${apiUrl}/produk/${id}`, {
      nama: produkData.nama,
      harga: produkData.harga,
      stock: produkData.stock,
      desc: produkData.desc,
      existingFileIds: produkData.existingFileIds,
      fotos: produkData.fotos ?? null,
    });

    if (response.status !== 200) {
      throw new Error("Failed to edit produk");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error editing produk");
  }
};

export const deleteProduk = async (id: number): Promise<void> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.delete(`${apiUrl}/produk/${id}`);

    if (response.status !== 200) {
      throw new Error("Failed to delete Produk data");
    }

    console.log(`Produk dengan ID ${id} berhasil dihapus`);
  } catch (error: any) {
    throw new Error(
      error.message || "Something went wrong while deleting Produk",
    );
  }
};

export const getProdukImage = async (foto: string): Promise<void> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.delete(`${apiUrl}/uploads/${foto}`);

    if (response.status !== 200) {
      throw new Error("Failed to delete Produk data");
    }

    console.log(`Produk dengan nama ${foto} berhasil dihapus`);
  } catch (error: any) {
    throw new Error(
      error.message || "Something went wrong while deleting Produk",
    );
  }
};
