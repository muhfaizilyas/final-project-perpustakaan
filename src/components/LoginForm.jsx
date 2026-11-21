"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import FormField from "@/components/FormField";

const initialState = { errors: {}, message: "", values: {} };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.message && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      )}
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.values.email}
        error={state.errors.email}
        placeholder="nama@student.kampus.ac.id"
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        error={state.errors.password}
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
