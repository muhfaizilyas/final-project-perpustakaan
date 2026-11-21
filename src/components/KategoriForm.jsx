"use client";

import { useActionState } from "react";
import Link from "next/link";
import FormField from "@/components/FormField";

// action: createKategori, atau updateKategori.bind(null, id)
export default function KategoriForm({ action, initial = {}, submitLabel }) {
  const [state, formAction, pending] = useActionState(action, {
    errors: {},
    message: "",
    values: initial,
  });
  const v = state.values;

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.message && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      )}
      <FormField label="Nama kategori" name="nama" defaultValue={v.nama} error={state.errors.nama} />
      <FormField label="Kode" name="kode" defaultValue={v.kode} error={state.errors.kode} placeholder="Contoh: TI" />
      <div>
        <label htmlFor="deskripsi" className="mb-1 block text-sm font-medium">
          Deskripsi (opsional)
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={3}
          defaultValue={v.deskripsi ?? ""}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {state.errors.deskripsi && (
          <p className="mt-1 text-xs text-red-600">{state.errors.deskripsi}</p>
        )}
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? "Menyimpan..." : submitLabel}
        </button>
        <Link
          href="/dashboard/admin/kategori"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
