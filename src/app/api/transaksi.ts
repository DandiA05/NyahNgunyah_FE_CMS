import axios from "axios";

export type Produk = {
  id: number;
  nama: string;
  harga: string; // atau number, tergantung format harga yang digunakan
  foto: string;
  createdAt: string;
  updatedAt: string;
};

export type DetailTransaksi = {
  id: number;
  quantity: number;
  subtotal: string; // bisa menggunakan number jika lebih baik
  createdAt: string;
  updatedAt: string;
  produk: Produk; // Hubungan ke objek Produk
};

export type Transaksi = {
  id: number;
  nomor_transaksi: string;
  nama_pembeli: string;
  alamat: string;
  kode_pos: string;
  status: string;
  tanggal: string;
  bukti_transfer: string;
  metode_pengiriman: string;
  total_harga: string; // atau number jika lebih sesuai
  createdAt: string;
  updatedAt: string;
  details: DetailTransaksi[]; // Array dari detail transaksi
};

interface FetchTransaksiParams {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const fetchTransaksi = async ({
  search,
  status,
  startDate,
  endDate,
}: FetchTransaksiParams = {}): Promise<Transaksi[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await axios.get(
      `${apiUrl}/transaksi?${params.toString()}`,
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch transaksi data");
    }

    const rawData = response.data;
    const cleanData = JSON.parse(JSON.stringify(rawData));
    return cleanData;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export async function updateStatusTransaksi(id: number, status: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.patch(`${apiUrl}/transaksi/${id}/status`, {
    status,
  });
  const rawData = response.data;
  const cleanData = JSON.parse(JSON.stringify(rawData));
  return cleanData;
}
export const fetchTransaksiById = async (id: number): Promise<Transaksi[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.get(`${apiUrl}/transaksi/${id}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch transaksi data");
    }

    const rawData = response.data;
    const cleanData = JSON.parse(JSON.stringify(rawData));
    return cleanData;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const addProduk = async (produkData: {
  nama: string;
  harga: number;
  foto: File | null;
}): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Membuat objek FormData
  const formData = new FormData();

  // Menambahkan data ke FormData
  formData.append("nama", produkData.nama);
  formData.append("harga", produkData.harga.toString()); // Harga harus string
  if (produkData.foto) {
    formData.append("foto", produkData.foto);
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

    const rawData = response.data;
    const cleanData = JSON.parse(JSON.stringify(rawData));
    return cleanData;
  } catch (error: any) {
    throw new Error(error.message || "Error adding produk");
  }
};

export const editProduk = async (
  id: number,
  produkData: {
    nama: string;
    harga: string;
    foto: File | string; // Use File type for foto
  },
): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Create a new FormData object
  const formData = new FormData();

  // Append form fields to FormData
  formData.append("nama", produkData.nama);
  formData.append("harga", produkData.harga);

  // Append the foto field, handle both File and string case
  if (produkData.foto instanceof File) {
    formData.append("foto", produkData.foto);
  } else {
    formData.append("foto", produkData.foto); // If foto is a string (file name)
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

    const rawData = response.data;
    const cleanData = JSON.parse(JSON.stringify(rawData));
    return cleanData;
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
