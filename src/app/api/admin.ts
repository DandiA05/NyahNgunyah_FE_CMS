import axios from "axios";

export type AdminType = {
  id: number;
  firstName: string;
  nama_belakang: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  password: number;
};

export const fetchAdmin = async (): Promise<AdminType[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.get(`${apiUrl}/user`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch admin data");
    }

    console.log(response.data.data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const fetchPegawaiById = async (id: number): Promise<AdminType[]> => {
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

export const addAdmin = async (adminData: {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  password: string;
}): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.post(`${apiUrl}/user`, adminData);

    if (response.status !== 201) {
      throw new Error("Failed to add admin data");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error adding admin data");
  }
};

export const editAdmin = async (
  id: number,
  pegawaiData: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    password: string;
  },
): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.put(`${apiUrl}/user/${id}`, pegawaiData);

    if (response.status !== 200) {
      throw new Error("Failed to edit pegawai");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error editing pegawai");
  }
};

export const fetchAdminById = async (id: number): Promise<AdminType[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.get(`${apiUrl}/user/${id}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch user data");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const deleteAdmin = async (id: number): Promise<void> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await axios.delete(`${apiUrl}/user/${id}`);

    if (response.status !== 200) {
      throw new Error("Failed to delete user data");
    }

    console.log(`user dengan ID ${id} berhasil dihapus`);
  } catch (error: any) {
    throw new Error(
      error.message || "Something went wrong while deleting user",
    );
  }
};
