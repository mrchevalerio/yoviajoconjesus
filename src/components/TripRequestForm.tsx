"use client";

import { useState } from "react";
import {
  User,
  EnvelopeSimple,
  Phone,
  Airplane,
  MapPin,
  CalendarBlank,
  ChatText,
  CircleNotch,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";
import Stepper from "./booking/Stepper";

interface FormState {
  full_name: string;
  email: string;
  phone: string;
  destination: string;
  departure_city: string;
  preferred_date: string;
  number_of_travelers: number;
  message: string;
}

const INITIAL_FORM: FormState = {
  full_name: "",
  email: "",
  phone: "",
  destination: "",
  departure_city: "",
  preferred_date: "",
  number_of_travelers: 1,
  message: "",
};

type FieldErrors = Partial<Record<"full_name" | "email" | "destination", string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function TripRequestForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function patch(p: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...p }));
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!form.full_name.trim()) next.full_name = t("tripRequest.errorRequired");
    if (!form.email.trim()) next.email = t("tripRequest.errorRequired");
    else if (!EMAIL_PATTERN.test(form.email.trim())) next.email = t("tripRequest.errorEmail");
    if (!form.destination.trim()) next.destination = t("tripRequest.errorRequired");
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");

    const { error } = await supabase.from("trip_requests").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      destination: form.destination.trim(),
      departure_city: form.departure_city.trim() || null,
      preferred_date: form.preferred_date || null,
      number_of_travelers: form.number_of_travelers,
      message: form.message.trim() || null,
      status: "new",
    });

    if (error) {
      setStatus("error");
      return;
    }

    setForm(INITIAL_FORM);
    setErrors({});
    setStatus("success");
  }

  return (
    <>
      <span className="mb-4 block text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-dark">
        {t("tripRequest.eyebrow")}
      </span>
      <h1 className="mb-3 text-[clamp(26px,3.6vw,34px)]">{t("tripRequest.title")}</h1>
      <p className="mb-10 max-w-xl text-[15px] leading-relaxed text-ink-soft">{t("tripRequest.subtitle")}</p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {status === "success" && (
        <div className="flex items-start gap-3 rounded-md bg-success-tint px-4 py-3">
          <CheckCircle size={20} className="mt-0.5 shrink-0 text-success" weight="fill" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-ink">{t("tripRequest.successTitle")}</p>
            <p className="text-sm text-ink-soft">{t("tripRequest.successBody")}</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-3 rounded-md bg-danger-tint px-4 py-3">
          <WarningCircle size={20} className="mt-0.5 shrink-0 text-danger" weight="fill" aria-hidden />
          <p className="text-sm text-ink">{t("tripRequest.errorBody")}</p>
        </div>
      )}

      <div>
        <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-ink">
          {t("tripRequest.fullName")}
        </label>
        <div
          className={`flex items-center gap-2.5 rounded-md border bg-surface px-4 py-3 focus-within:border-accent ${
            errors.full_name ? "border-danger" : "border-border-strong"
          }`}
        >
          <User size={20} className="shrink-0 text-ink-faint" aria-hidden />
          <input
            id="full_name"
            type="text"
            autoComplete="name"
            value={form.full_name}
            onChange={(e) => patch({ full_name: e.target.value })}
            className="w-full min-w-0 bg-transparent text-[15px] text-ink focus:outline-none"
          />
        </div>
        {errors.full_name && <p className="mt-1.5 text-xs text-danger">{errors.full_name}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            {t("tripRequest.email")}
          </label>
          <div
            className={`flex items-center gap-2.5 rounded-md border bg-surface px-4 py-3 focus-within:border-accent ${
              errors.email ? "border-danger" : "border-border-strong"
            }`}
          >
            <EnvelopeSimple size={20} className="shrink-0 text-ink-faint" aria-hidden />
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => patch({ email: e.target.value })}
              className="w-full min-w-0 bg-transparent text-[15px] text-ink focus:outline-none"
            />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
            {t("tripRequest.phone")}
          </label>
          <div className="flex items-center gap-2.5 rounded-md border border-border-strong bg-surface px-4 py-3 focus-within:border-accent">
            <Phone size={20} className="shrink-0 text-ink-faint" aria-hidden />
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => patch({ phone: e.target.value })}
              className="w-full min-w-0 bg-transparent text-[15px] text-ink focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="destination" className="mb-1.5 block text-sm font-medium text-ink">
            {t("tripRequest.destination")}
          </label>
          <div
            className={`flex items-center gap-2.5 rounded-md border bg-surface px-4 py-3 focus-within:border-accent ${
              errors.destination ? "border-danger" : "border-border-strong"
            }`}
          >
            <Airplane size={20} className="shrink-0 text-ink-faint" aria-hidden />
            <input
              id="destination"
              type="text"
              placeholder={t("tripRequest.destinationPlaceholder")}
              value={form.destination}
              onChange={(e) => patch({ destination: e.target.value })}
              className="w-full min-w-0 bg-transparent text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </div>
          {errors.destination && <p className="mt-1.5 text-xs text-danger">{errors.destination}</p>}
        </div>

        <div>
          <label htmlFor="departure_city" className="mb-1.5 block text-sm font-medium text-ink">
            {t("tripRequest.departureCity")}
          </label>
          <div className="flex items-center gap-2.5 rounded-md border border-border-strong bg-surface px-4 py-3 focus-within:border-accent">
            <MapPin size={20} className="shrink-0 text-ink-faint" aria-hidden />
            <input
              id="departure_city"
              type="text"
              placeholder={t("tripRequest.departureCityPlaceholder")}
              value={form.departure_city}
              onChange={(e) => patch({ departure_city: e.target.value })}
              className="w-full min-w-0 bg-transparent text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="preferred_date" className="mb-1.5 block text-sm font-medium text-ink">
            {t("tripRequest.preferredDate")}
          </label>
          <div className="flex items-center gap-2.5 rounded-md border border-border-strong bg-surface px-4 py-3 focus-within:border-accent">
            <CalendarBlank size={20} className="shrink-0 text-ink-faint" aria-hidden />
            <input
              id="preferred_date"
              type="date"
              value={form.preferred_date}
              onChange={(e) => patch({ preferred_date: e.target.value })}
              className="w-full min-w-0 bg-transparent text-[15px] text-ink focus:outline-none"
            />
          </div>
        </div>

        <Stepper
          label={t("tripRequest.travelers")}
          value={form.number_of_travelers}
          min={1}
          max={20}
          onChange={(number_of_travelers) => patch({ number_of_travelers })}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          {t("tripRequest.message")}
        </label>
        <div className="flex items-start gap-2.5 rounded-md border border-border-strong bg-surface px-4 py-3 focus-within:border-accent">
          <ChatText size={20} className="mt-0.5 shrink-0 text-ink-faint" aria-hidden />
          <textarea
            id="message"
            rows={4}
            placeholder={t("tripRequest.messagePlaceholder")}
            value={form.message}
            onChange={(e) => patch({ message: e.target.value })}
            className="w-full min-w-0 resize-none bg-transparent text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-accent px-8 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === "submitting" && <CircleNotch size={18} className="animate-spin" aria-hidden />}
        {status === "submitting" ? t("tripRequest.submitting") : t("tripRequest.submit")}
      </button>
    </form>
    </>
  );
}
