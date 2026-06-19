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
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);

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
      } finally {
        if (!cancelled) setIsLoadingLatest(false);
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
    <div className="flex flex-col flex-1 items-center bg-zinc-50 px-4 sm:px-6">
      <main className="w-full max-w-2xl py-8 sm:py-12 space-y-6 sm:space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            PrepWise AI
          </h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Smart Study Planner — enter your details and get a personalized
            AI-powered study schedule using spaced repetition and active recall.
          </p>
          <nav>
            <Link
              href="/plans"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded"
            >
              View saved plans
              <span aria-hidden="true">→</span>
            </Link>
          </nav>
        </header>

        {/* Error banner */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in fade-in"
          >
            <div className="flex items-start justify-between gap-2">
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="shrink-0 text-red-400 hover:text-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Form card */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Create a Study Plan
          </h2>
          <StudyForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        {/* Divider when plan exists */}
        {plan && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Your Plan
            </span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>
        )}

        {/* Plan output / Loading latest */}
        {isLoadingLatest && !plan && (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
            <p className="text-sm text-zinc-400">
              Checking for saved plans…
            </p>
          </div>
        )}

        {plan && (
          <section className="transition-opacity duration-300">
            <PlanCard plan={plan} />
          </section>
        )}
      </main>
    </div>
  );
}
