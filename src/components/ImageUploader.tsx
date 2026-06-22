import Image from "next/image";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { deleteCloudinaryAsset } from "@/app/api/cloudinary";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface DefaultImage {
  id: number;
  foto: string; // URL
  publicId?: string; // Cloudinary publicId
}

interface ImageUploaderProps {
  onUploadsChange: (
    newUploads: { url: string; publicId: string }[],
    remainingDbIds: number[]
  ) => void;
  error?: string;
  defaultImages?: DefaultImage[];
}

interface PreviewItem {
  id?: number; // DB ID if existing
  url: string;
  publicId?: string; // Cloudinary publicId
  isNew: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadsChange,
  error,
  defaultImages = [],
}) => {
  const [images, setImages] = useState<PreviewItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize with default images
  useEffect(() => {
    if (defaultImages.length > 0) {
      const initialized = defaultImages.map((img) => ({
        id: img.id,
        url: img.foto,
        publicId: img.publicId,
        isNew: false,
      }));
      setImages(initialized);
    }
  }, [defaultImages]);

  // Propagate state changes to parent whenever images list changes
  const propagateChanges = (currentImages: PreviewItem[]) => {
    const newUploads = currentImages
      .filter((img) => img.isNew && img.publicId)
      .map((img) => ({ url: img.url, publicId: img.publicId as string }));

    const remainingDbIds = currentImages
      .filter((img) => !img.isNew && img.id)
      .map((img) => img.id as number);

    onUploadsChange(newUploads, remainingDbIds);
  };

  const handleOpenWidget = () => {
    if (typeof window === "undefined" || !window.cloudinary) {
      Swal.fire("Error", "Cloudinary Widget is loading, please wait.", "warning");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!cloudName || cloudName === "your_cloud_name") {
      Swal.fire("Error", "Cloudinary Cloud Name is not configured.", "error");
      return;
    }

    if (!apiKey || apiKey === "your_api_key") {
      Swal.fire("Error", "Cloudinary API Key is not configured.", "error");
      return;
    }

    window.cloudinary.openUploadWidget(
      {
        cloudName,
        apiKey,
        uploadSignature: async (callback: any, paramsToSign: any) => {
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.get(`${apiUrl}/cloudinary/signature`, {
              params: paramsToSign,
            });
            // The signature is expected to be returned in response.data.signature
            callback(response.data.signature);
          } catch (err: any) {
            console.error("Failed to generate signature:", err);
            Swal.fire("Error", "Gagal mendapatkan upload signature.", "error");
            setIsUploading(false);
          }
        },
        sources: ["local", "url", "camera"],
        multiple: true,
        cropping: false,
        resourceType: "image",
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
      },
      (err: any, result: any) => {
        if (err) {
          console.error("Upload Widget Error:", err);
          Swal.fire("Error", err.message || "Gagal mengupload gambar.", "error");
          setIsUploading(false);
          return;
        }

        if (result) {
          if (result.event === "uploading") {
            setIsUploading(true);
          } else if (result.event === "success") {
            const { secure_url, public_id } = result.info;
            setImages((prev) => {
              const updated = [
                ...prev,
                { url: secure_url, publicId: public_id, isNew: true },
              ];
              propagateChanges(updated);
              return updated;
            });
          } else if (result.event === "queues-end" || result.event === "close") {
            setIsUploading(false);
          }
        }
      }
    );
  };

  const handleRemove = async (index: number) => {
    const targetImage = images[index];

    // Confirm deletion
    const confirmation = await Swal.fire({
      title: "Hapus Gambar?",
      text: "Gambar ini akan dihapus dari Cloudinary secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!confirmation.isConfirmed) return;

    // Show loading for delete action
    Swal.showLoading();

    try {
      if (targetImage.publicId) {
        // Triggers the backend call to delete from Cloudinary
        await deleteCloudinaryAsset(targetImage.publicId);
      }

      setImages((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        propagateChanges(updated);
        return updated;
      });

      Swal.fire("Dihapus!", "Gambar berhasil dihapus.", "success");
    } catch (err: any) {
      console.error("Delete asset error:", err);
      Swal.fire("Error", err.message || "Gagal menghapus gambar.", "error");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Load Cloudinary Widget Script */}
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="lazyOnload"
      />

      <button
        type="button"
        onClick={handleOpenWidget}
        disabled={isUploading}
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition hover:border-primary hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4 w-full"
      >
        {isUploading ? (
          <div className="flex items-center gap-2 text-primary">
            <svg
              className="animate-spin h-5 w-5 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-sm font-medium">Uploading to Cloudinary...</span>
          </div>
        ) : (
          <>
            <svg
              className="h-10 w-10 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <p className="text-sm text-gray-500 dark:text-white font-medium">
              Click to Upload Images via Cloudinary
            </p>
          </>
        )}
      </button>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {images.map((item, index) => (
          <div
            key={item.publicId || item.url || index}
            className="group relative aspect-square w-full overflow-hidden rounded border border-stroke dark:border-strokedark"
          >
            <Image
              src={item.url}
              alt={`Preview ${index}`}
              fill
              className="rounded object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black bg-opacity-60 text-xs text-white opacity-0 transition group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default ImageUploader;
