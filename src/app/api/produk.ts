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
  foto: string;
  foto_public_id: string;
  fotos: { foto: string; public_id: string }[];
}): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.post(`${apiUrl}/produk`, {
      nama: produkData.nama,
      desc: produkData.desc,
      harga: produkData.harga,
      stock: produkData.stock,
      foto: produkData.foto,
      foto_public_id: produkData.foto_public_id,
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
    foto: string;
    foto_public_id: string;
    fotos: { id?: number; foto: string; public_id: string }[];
  },
): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.put(`${apiUrl}/produk/${id}`, {
      nama: produkData.nama,
      desc: produkData.desc,
      harga: Number(produkData.harga), // Ensure harga is number if BE requires it or keep it as is
      stock: produkData.stock,
      foto: produkData.foto,
      foto_public_id: produkData.foto_public_id,
      fotos: produkData.fotos,
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
