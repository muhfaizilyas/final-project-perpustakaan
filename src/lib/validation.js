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
