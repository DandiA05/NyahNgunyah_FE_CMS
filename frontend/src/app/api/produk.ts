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
  fotos: File[] | null;
}): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Membuat objek FormData
  const formData: any = new FormData();

  // Menambahkan data ke FormData
  formData.append("nama", produkData.nama);
  formData.append("harga", produkData.harga.toString()); // Harga harus string
  formData.append("stock", produkData.stock);
  formData.append("desc", produkData.desc);
  

  if (produkData.fotos) {
    for (let i = 0; i < produkData.fotos.length; i++) {
      formData.append("fotos", produkData.fotos[i]);
    }
  }

  try {
    const response = await axios.post(`${apiUrl}/produk`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Mengatur header agar axios tahu ini adalah form data
      },
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
    fotos?: File[] | null; // Use File type for foto
    existingFileIds: number[];
  },
): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Create a new FormData object
  const formData: any = new FormData();

  // Append form fields to FormData
  formData.append("nama", produkData.nama);
  formData.append("harga", produkData.harga);
  formData.append("stock", produkData.stock);
  formData.append("desc", produkData.desc);
  formData.append("existingFileIds", JSON.stringify(produkData.existingFileIds));

  // Append the foto field, handle both File and string case
  if (produkData.fotos) {
    for (let i = 0; i < produkData.fotos.length; i++) {
      if(produkData.fotos[i] instanceof File){
      formData.append("fotos", produkData.fotos[i]);
      }
    }
  }

  try {
    const response = await axios.put(`${apiUrl}/produk/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Specify that the request contains a file
      },
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
