"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import FormField from "@/components/FormField";

const initialState = { errors: {}, message: "", values: {} };

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.message && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      )}
      <FormField
        label="Nama lengkap"
        name="nama_lengkap"
        autoComplete="name"
        defaultValue={state.values.nama_lengkap}
        error={state.errors.nama_lengkap}
      />
      <FormField
        label="Email kampus"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.values.email}
        error={state.errors.email}
        placeholder="nama@student.kampus.ac.id"
      />
      <FormField
        label="NIM"
        name="nomor_identitas"
        defaultValue={state.values.nomor_identitas}
        error={state.errors.nomor_identitas}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        error={state.errors.password}
      />
      <FormField
        label="Konfirmasi password"
        name="konfirmasi"
        type="password"
        autoComplete="new-password"
        error={state.errors.konfirmasi}
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Memproses..." : "Daftar"}
      </button>
    </form>
  );
}
