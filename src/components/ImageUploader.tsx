import Image from "next/image";
import React, { useEffect, useState } from "react";

interface DefaultImage {
  id: number;
  foto: string; // URL
}

interface ImageUploaderProps {
  onFileSelect: (files: File[], deletedIds: number[]) => void; // tambah deletedIds
  error?: string;
  defaultImages?: DefaultImage[];
}

type PreviewItem = DefaultImage | File;

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileSelect,
  error,
  defaultImages = [],
}) => {
  const [previewUrls, setPreviewUrls] = useState<PreviewItem[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]); // track foto lama yg dihapus

  useEffect(() => {
    if (defaultImages.length > 0) {
      setPreviewUrls(defaultImages);
    }
  }, [defaultImages]);

  const handleFiles = (newFiles: File[]) => {
    setFiles((prevFiles) => {
      // Hindari duplikat file
      const uniqueFiles = newFiles.filter(
        (file) => !prevFiles.some((f) => f.name === file.name && f.size === file.size)
      );
      const updatedFiles = [...prevFiles, ...uniqueFiles];
      onFileSelect(updatedFiles, deletedIds);
      return updatedFiles;
    });

    setPreviewUrls((prev) => {
      // Filter newFiles yg belum ada di previewUrls
      const uniquePreviews = newFiles.filter(
        (file) =>
          !prev.some(
            (p) =>
              p instanceof File && p.name === file.name && p.size === file.size
          )
      );
      return [...prev, ...uniquePreviews];
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []).filter((file) =>
      file.type.startsWith("image/")
    );
    if (selectedFiles.length > 0) {
      handleFiles(selectedFiles);
    }
  };

  const handleRemove = (index: number) => {
    const newPreviewUrls = [...previewUrls];
    const removed = newPreviewUrls.splice(index, 1)[0];

    setPreviewUrls(newPreviewUrls);

    if (removed instanceof File) {
      // hapus file baru
      const newFiles = files.filter((f) => f !== removed);
      setFiles(newFiles);
      onFileSelect(newFiles, deletedIds);
    } else {
      // hapus foto lama berdasarkan id, simpan id di deletedIds
      setDeletedIds((prev) => {
        const updatedDeletedIds = [...prev, removed.id];
        onFileSelect(files, updatedDeletedIds);
        return updatedDeletedIds;
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition hover:border-primary"
      >
        <p className="text-gray-500 dark:text-white">
          Drag & drop image here or click to upload
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </label>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {previewUrls.map((item, index) => {
          const src = item instanceof File ? URL.createObjectURL(item) : item.foto;
          return (
            <div
              key={item instanceof File ? item.name + item.size : item.id}
              className="group relative aspect-square w-full overflow-hidden rounded"
            >
              <Image
                src={src}
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
          );
        })}
      </div>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default ImageUploader;
