import axios from "axios";

export type Pegawai = {
  id: number;
  nama_depan: string;
  nama_belakang: string; 
  jabatan: string;
  email: string;
  no_hp: string; 
  jenis_kelamin: string; 
  sisa_cuti: number; 
  address: string; 
};



export const fetchPegawai = async (): Promise<Pegawai[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; 

  try {
    const response = await axios.get(`${apiUrl}/pegawai`);

    // Check if response was successful (status code 2xx)
    if (response.status !== 200) {
      throw new Error("Failed to fetch pegawai data");
    }

    // Assuming your response data is in `data.data`
    console.log(response.data.data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const fetchPegawaiById = async (id: number): Promise<Pegawai[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.get(`${apiUrl}/pegawai/${id}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch pegawai data");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const addPegawai = async (pegawaiData: {
  nama_depan: string;
  nama_belakang: string;
  email: string;
  no_hp: string;
  jenis_kelamin: string;
  address: string;
}): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; 

  try {
    const response = await axios.post(`${apiUrl}/pegawai`, pegawaiData);

    if (response.status !== 201) {
      throw new Error("Failed to add pegawai");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error adding pegawai");
  }
};

export const editPegawai = async (
  id: number,
  pegawaiData: {
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
    const response = await axios.put(`${apiUrl}/pegawai/${id}`, pegawaiData);

    if (response.status !== 200) {
      throw new Error("Failed to edit pegawai");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error editing pegawai");
  }
};
export const deletePegawai = async (id: number): Promise<void> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.delete(`${apiUrl}/pegawai/${id}`);

    if (response.status !== 200) {
      throw new Error("Failed to delete pegawai data");
    }

    console.log(`Pegawai dengan ID ${id} berhasil dihapus`);
  } catch (error: any) {
    throw new Error(
      error.message || "Something went wrong while deleting pegawai",
    );
  }
};
