"use client";

import { useState } from "react";
import StudyForm, { type StudyFormData } from "@/components/StudyForm";
import PlanCard, { type StudyPlan } from "@/components/PlanCard";

export default function Home() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: StudyFormData) {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "An unexpected error occurred.");
        return;
      }

      setPlan(json as StudyPlan);
    } catch {
      setError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 px-6">
      <main className="w-full max-w-2xl py-12 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            PrepWise AI – Smart Study Planner
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Enter your details and get a personalized AI-powered study schedule.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex items-start justify-between gap-2">
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Create a Study Plan
          </h2>
          <StudyForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Plan output */}
        {plan && <PlanCard plan={plan} />}
      </main>
    </div>
  );
}
