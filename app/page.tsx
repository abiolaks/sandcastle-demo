"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StudyForm, { type StudyFormData } from "@/components/StudyForm";
import PlanCard, { type StudyPlan } from "@/components/PlanCard";
import { getSupabase } from "@/lib/supabase";

export default function Home() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load the most recent plan on mount
  useEffect(() => {
    let cancelled = false;

    async function loadLatest() {
      try {
        const supabase = getSupabase();
        const { data, error: dbError } = await supabase
          .from("plans")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (dbError) {
          // No plans exist yet — that's fine, show the form.
          if (dbError.code !== "PGRST116") {
            console.error("Failed to load latest plan:", dbError);
          }
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const row = data as Record<string, any> | null;
        if (row && !cancelled) {
          const content = row.plan_content as StudyPlan;
          setPlan({ ...content, id: row.id });
        }
      } catch {
        // Silently fail — the form is still usable.
      }
    }

    loadLatest();
    return () => {
      cancelled = true;
    };
  }, []);

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
          <p className="mt-2">
            <Link
              href="/plans"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View saved plans →
            </Link>
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
