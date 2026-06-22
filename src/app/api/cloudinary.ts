import axios from "axios";
import Cookies from "js-cookie";

/**
 * Deletes an asset from Cloudinary via the backend API.
 * @param publicId The Cloudinary public ID of the asset to delete.
 */
export const deleteCloudinaryAsset = async (publicId: string): Promise<void> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = Cookies.get("access_token");

  try {
    const response = await axios.delete(`${apiUrl}/cloudinary/assets`, {
      data: { publicId }, // Send publicId in the request body
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to delete asset from Cloudinary");
    }

    console.log(`Cloudinary asset with public ID ${publicId} successfully deleted`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Something went wrong while deleting asset from Cloudinary"
    );
  }
};
