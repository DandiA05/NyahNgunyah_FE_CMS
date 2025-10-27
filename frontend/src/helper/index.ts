export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "Menunggu Konfirmasi";
    case "process":
      return "Sedang Diproses";
    case "deliver":
      return "Sedang Dikirim";
    case "cancelled":
      return "Dibatalkan";
    case "completed":
      return "Selesai";
    default:
      return "Tidak Diketahui";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200";
    case "process":
      return "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200";
    case "deliver":
      return "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200";
    case "cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
  }
};

export const formatHarga = (harga: number) => {
  if (isNaN(harga)) return "Rp 0"; // Validasi jika harga bukan angka
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Tidak ada pecahan desimal
  }).format(harga);
};
