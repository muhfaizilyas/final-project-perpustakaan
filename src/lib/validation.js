// Ubah sesuai domain kampus di spesifikasi tugas kalau berbeda.
export const DOMAIN_EMAIL_MAHASISWA = "@student.kampus.ac.id";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email) errors.email = "Email wajib diisi.";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Format email tidak valid.";
  if (!password) errors.password = "Password wajib diisi.";
  return errors;
}

export function validateRegister({
  nama_lengkap,
  email,
  nomor_identitas,
  password,
  konfirmasi,
}) {
  const errors = {};

  if (!nama_lengkap) errors.nama_lengkap = "Nama lengkap wajib diisi.";
  else if (nama_lengkap.length < 3)
    errors.nama_lengkap = "Nama minimal 3 karakter.";

  if (!email) errors.email = "Email wajib diisi.";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Format email tidak valid.";
  else if (!email.endsWith(DOMAIN_EMAIL_MAHASISWA))
    errors.email = `Gunakan email kampus (${DOMAIN_EMAIL_MAHASISWA}).`;

  if (!nomor_identitas) errors.nomor_identitas = "NIM wajib diisi.";
  else if (!/^\d{5,20}$/.test(nomor_identitas))
    errors.nomor_identitas = "NIM harus berupa angka (5-20 digit).";

  if (!password) errors.password = "Password wajib diisi.";
  else if (password.length < 8)
    errors.password = "Password minimal 8 karakter.";

  if (!konfirmasi) errors.konfirmasi = "Konfirmasi password wajib diisi.";
  else if (password !== konfirmasi)
    errors.konfirmasi = "Konfirmasi password tidak sama.";

  return errors;
}

export function validateKategori({ nama, kode, deskripsi }) {
  const errors = {};

  if (!nama) errors.nama = "Nama kategori wajib diisi.";
  else if (nama.length < 3) errors.nama = "Nama minimal 3 karakter.";
  else if (nama.length > 100) errors.nama = "Nama maksimal 100 karakter.";

  if (!kode) errors.kode = "Kode kategori wajib diisi.";
  else if (!/^[A-Z0-9]{2,20}$/.test(kode))
    errors.kode = "Kode 2-20 karakter, hanya huruf dan angka (contoh: TI).";

  if (deskripsi && deskripsi.length > 500)
    errors.deskripsi = "Deskripsi maksimal 500 karakter.";

  return errors;
}

// Semua nilai masuk sebagai string (dari form). Konversi angka dilakukan di action.
export function validateBuku(v) {
  const errors = {};
  const tahunMaks = new Date().getFullYear();

  if (!v.judul) errors.judul = "Judul wajib diisi.";
  else if (v.judul.length > 200) errors.judul = "Judul maksimal 200 karakter.";

  const isbnAngka = v.isbn.replace(/[-\s]/g, "");
  if (!v.isbn) errors.isbn = "ISBN wajib diisi.";
  else if (!/^(\d{10}|\d{13})$/.test(isbnAngka))
    errors.isbn = "ISBN harus 10 atau 13 digit angka (tanda hubung boleh).";
  else if (v.isbn.length > 20) errors.isbn = "ISBN maksimal 20 karakter.";

  if (!v.pengarang) errors.pengarang = "Pengarang wajib diisi.";
  else if (v.pengarang.length > 150) errors.pengarang = "Pengarang maksimal 150 karakter.";

  if (!v.penerbit) errors.penerbit = "Penerbit wajib diisi.";
  else if (v.penerbit.length > 150) errors.penerbit = "Penerbit maksimal 150 karakter.";

  if (!/^\d+$/.test(v.tahun_terbit))
    errors.tahun_terbit = "Tahun terbit harus berupa angka.";
  else if (Number(v.tahun_terbit) < 1000 || Number(v.tahun_terbit) > tahunMaks)
    errors.tahun_terbit = `Tahun terbit harus antara 1000 dan ${tahunMaks}.`;

  if (!/^\d+$/.test(v.category_id)) errors.category_id = "Pilih kategori.";

  if (!/^-?\d+$/.test(v.stok_total)) errors.stok_total = "Stok total harus berupa angka.";
  else if (Number(v.stok_total) < 0) errors.stok_total = "Stok total tidak boleh negatif.";
  else if (Number(v.stok_total) > 100000) errors.stok_total = "Stok total terlalu besar.";

  if (!/^\d+$/.test(v.durasi_maks_pinjam))
    errors.durasi_maks_pinjam = "Durasi harus berupa angka (hari).";
  else if (Number(v.durasi_maks_pinjam) < 1 || Number(v.durasi_maks_pinjam) > 365)
    errors.durasi_maks_pinjam = "Durasi harus antara 1 dan 365 hari.";

  if (!/^-?\d+$/.test(v.denda_per_hari)) errors.denda_per_hari = "Denda harus berupa angka.";
  else if (Number(v.denda_per_hari) < 0) errors.denda_per_hari = "Denda tidak boleh negatif.";
  else if (Number(v.denda_per_hari) > 100000000) errors.denda_per_hari = "Denda terlalu besar.";

  if (v.cover_url) {
    if (!/^https?:\/\/\S+$/i.test(v.cover_url))
      errors.cover_url = "URL cover harus diawali http:// atau https://.";
    else if (v.cover_url.length > 500) errors.cover_url = "URL cover terlalu panjang.";
  }

  return errors;
}
