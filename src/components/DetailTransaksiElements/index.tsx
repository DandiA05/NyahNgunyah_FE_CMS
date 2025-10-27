"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import moment from "moment";
import Swal from "sweetalert2";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { fetchTransaksiById, updateStatusTransaksi } from "@/app/api/transaksi";
import { formatHarga, getStatusColor, getStatusLabel } from "@/helper";

const validationSchema = z.object({
  namaProduk: z.string().min(1, { message: "Nama Produk wajib diisi" }),
  harga: z.string().min(1, { message: "Harga wajib diisi" }),
});

type FormData = {
  namaProduk: string;
  harga: number;
  foto: File | null;
};

const DetailTransaksiElements = () => {
  const { register, setValue } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
  });

  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [dataTransaksi, setDataTransaksi] = useState<any>(null);
  const [produkList, setProdukList] = useState<any[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    flatpickr(".form-datepicker", { dateFormat: "m/d/Y" });
  }, []);

  useEffect(() => {
    fetchDataById(Number(id));
  }, [id]);

  const fetchDataById = async (id: number) => {
    try {
      setLoading(true);
      const data: any = await fetchTransaksiById(id);
      setDataTransaksi(data);
      setProdukList(data.details);
      setStatus(data.status || "");
    } catch (err: any) {
      Swal.fire(
        "Gagal!",
        err.message || "Gagal mengambil data transaksi",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!status) {
      Swal.fire(
        "Perhatian",
        "Silakan pilih status terlebih dahulu.",
        "warning",
      );
      return;
    }

    try {
      setLoading(true);
      await updateStatusTransaksi(Number(dataTransaksi.id), status);

      const pesanMap: Record<string, string> = {
        pending: `Halo ${dataTransaksi.nama_pembeli}, pesanan Anda sedang *menunggu konfirmasi*. Mohon ditunggu ya`,
        process: `Halo ${dataTransaksi.nama_pembeli}, pesanan Anda saat ini sedang *diproses*. Kami akan segera mengirimkan update berikutnya`,
        deliver: `Halo ${dataTransaksi.nama_pembeli}, pesanan Anda sedang *dikirim*. Mohon pastikan nomor penerima aktif untuk menerima paket`,
        cancelled: `Halo ${dataTransaksi.nama_pembeli}, mohon maaf, pesanan Anda *dibatalkan*. Silakan hubungi kami jika ada pertanyaan`,
        completed: `Halo ${dataTransaksi.nama_pembeli}, pesanan Anda telah *selesai*. Terima kasih sudah berbelanja di toko kami!`,
      };

      const encodeForWa = (text: string) => {
        // encode tapi biarkan emoji dan tanda * _ ~ tetap terbaca
        return encodeURIComponent(text)
          .replace(/%20/g, "+") // ubah spasi ke '+', lebih WA-friendly
          .replace(/%2A/g, "*") // biarkan tanda bold
          .replace(/%7E/g, "~") // biarkan tanda strikethrough
          .replace(/%0A/g, "%0A"); // newline tetap sama
      };

      const pesan =
        pesanMap[status] ||
        `Halo ${dataTransaksi.nama_pembeli}, status pesanan Anda telah diperbarui menjadi *${status}*.`;

      const nomorWa = dataTransaksi?.telp
        ?.replace(/\D/g, "")
        ?.replace(/^0/, "62");

      const waLink = nomorWa
        ? `https://wa.me/${nomorWa}?text=${encodeForWa(pesan)}`
        : null;

      // Tampilkan popup sukses + WA button
      Swal.fire({
        title: "Berhasil!",
        text: "Status transaksi berhasil diperbarui.",
        icon: "success",
        showCancelButton: !!waLink,
        confirmButtonText: "OK",
        cancelButtonText: "Kirim WhatsApp",
        reverseButtons: true,
        cancelButtonColor: "#25D366",
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel && waLink) {
          window.open(waLink, "_blank");
        }
        if (result.isConfirmed) {
          router.back();
        }
      });

      // refresh data setelah update
      fetchDataById(Number(id));
    } catch (err: any) {
      Swal.fire(
        "Gagal!",
        err.message || "Tidak dapat memperbarui status",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb
        pageName="Detail Transaksi"
        paths={[{ name: "Data Transaksi", href: "/transaksi" }]}
      />

      {/* Wrapper utama */}
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          {/* Kartu Detail Transaksi */}

          <div className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* 🟢 Status Chip di kiri */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-300">
                Status
              </label>
              <span
                className={`text-md rounded-full px-3 py-1 font-semibold ${getStatusColor(
                  (dataTransaksi?.status ?? "unknown").toLowerCase(),
                )}`}
              >
                {getStatusLabel(dataTransaksi?.status ?? "unknown")}
              </span>

            </div>

            {/* 🔵 Update Status di kanan */}
            <div className="flex flex-col">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Update Status Transaksi
              </label>
              <div className="flex items-center gap-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                  <option value="">Pilih status...</option>
                  <option value="pending">Menunggu Konfirmasi</option>
                  <option value="process">Sedang Diproses</option>
                  <option value="deliver">Sedang Dikirim</option>
                  <option value="cancelled">Dibatalkan</option>
                  <option value="completed">Selesai</option>
                </select>

                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={loading}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-col md:flex-row">
              {/* Kolom kiri */}
              <div className="flex w-full flex-col gap-5 p-6">
                <InfoField
                  label="Nomor Transaksi"
                  value={dataTransaksi?.nomor_transaksi}
                />
                <InfoField
                  label="Tanggal Transaksi"
                  value={moment(dataTransaksi?.tanggal).format("DD MMMM YYYY")}
                />
                <InfoField
                  label="Nama Pembeli"
                  value={dataTransaksi?.nama_pembeli}
                />
                <InfoField label="Alamat" value={dataTransaksi?.alamat} />
                <InfoField
                  label="Total Harga"
                  value={formatHarga(Number(dataTransaksi?.total_harga))}
                />
              </div>

              {/* Kolom kanan */}
              <div className="flex w-full flex-col gap-5 p-6">
                {/* Bukti Transfer */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Bukti Transfer
                  </label>
                  {dataTransaksi?.bukti_transfer ? (
                    <div className="flex flex-col gap-3">
                      <div
                        className="relative h-100 w-100 cursor-pointer overflow-hidden rounded-lg border border-gray-300 transition hover:ring-2 hover:ring-blue-400"
                        onClick={() => setIsPreviewOpen(true)}
                      >
                        <Image
                          src={dataTransaksi.bukti_transfer}
                          alt="Bukti Transfer"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPreviewOpen(true)}
                          className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                          Lihat Gambar
                        </button>

                        <Link
                          href={dataTransaksi.bukti_transfer}
                          target="_blank"
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          Download
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Tidak ada bukti transfer
                    </span>
                  )}
                </div>

                {/* Update Status */}
              </div>
            </div>
          </div>

          {/* Detail Produk */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center px-6 py-5">
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                Detail Produk
              </span>
            </div>

            <div className="grid grid-cols-5 border-t border-gray-200 px-6 py-3 font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
              <div className="col-span-2">Nama Produk</div>
              <div className="col-span-1 text-center">Harga</div>
              <div className="col-span-1 text-center">Jumlah</div>
              <div className="col-span-1 text-center">Subtotal</div>
            </div>

            {produkList?.length === 0 ? (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                Tidak ada data produk
              </div>
            ) : (
              produkList?.map((produk, key) => (
                <div
                  key={key}
                  className="grid grid-cols-5 border-t border-gray-200 px-6 py-3 text-gray-800 dark:border-gray-700 dark:text-gray-100"
                >
                  <div className="col-span-2">{produk.produk.nama}</div>
                  <div className="col-span-1 text-center">
                    {formatHarga(Number(produk.produk.harga))}
                  </div>
                  <div className="col-span-1 text-center">
                    {produk.quantity}
                  </div>
                  <div className="col-span-1 text-center">
                    {formatHarga(
                      Number(produk.quantity) * Number(produk.produk.harga),
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Footer Total */}
            <div className="grid grid-cols-5 border-t border-gray-200 px-6 py-3 text-gray-800 dark:border-gray-700 dark:text-gray-100">
              <div className="col-span-3 text-left font-semibold">Total</div>
              <div className="col-span-1 text-center font-semibold">
                {produkList
                  .map((produk) => produk.quantity)
                  .reduce((a, b) => a + b, 0)}
              </div>
              <div className="col-span-1 text-center font-semibold">
                {formatHarga(Number(dataTransaksi?.total_harga))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Preview */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-3xl">
            <Image
              src={dataTransaksi.bukti_transfer}
              alt="Preview Bukti Transfer"
              width={900}
              height={900}
              className="rounded-lg object-contain"
            />
            <button
              className="absolute right-3 top-3 rounded-md bg-white/80 px-3 py-1 text-sm font-semibold text-gray-800 hover:bg-white"
              onClick={() => setIsPreviewOpen(false)}
            >
              ✕ Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* Komponen kecil agar input display rapi */
function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
        {label}
      </label>
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
        {value || "-"}
      </div>
    </div>
  );
}

export default DetailTransaksiElements;
