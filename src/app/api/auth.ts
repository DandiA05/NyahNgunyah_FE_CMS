// utils/fetchPegawai.ts

import axios from "axios";

export type Login = {
  email: string;
  password: string;
};

export const login = async (loginData: {
  email: string;
  password: string;
}): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; 

  try {
    const response = await axios.post(`${apiUrl}/auth/login`, loginData);

    if (response.status !== 201) {
      throw new Error("Failed to login");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error login");
  }
};
