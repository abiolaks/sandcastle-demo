"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PlanCard, { type StudyPlan } from "@/components/PlanCard";
import Spinner from "@/components/Spinner";
import { getSupabase } from "@/lib/supabase";

interface SavedPlan {
  id: string;
  subject: string;
  topics: string;
  exam_date: string;
  hours_per_day: number;
  plan_content: StudyPlan;
  created_at: string;
}

/** Normalize old and new plan data shapes into the current StudyPlan interface. */
function normalizePlan(row: SavedPlan): StudyPlan {
  const content = row.plan_content;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = content as Record<string, any>;

  // New format: plan_content.courseName exists
  if (typeof c.courseName === "string") {
    return {
      id: row.id,
      courseName: c.courseName,
      hoursPerDay: c.hoursPerDay ?? row.hours_per_day,
      examDate: c.examDate ?? row.exam_date,
      schedule: Array.isArray(c.schedule) ? c.schedule : [],
    };
  }

  // Old format: plan_content has subject + topics instead of courseName
  return {
    id: row.id,
    courseName: c.subject || row.subject,
    hoursPerDay: c.hoursPerDay ?? row.hours_per_day,
    examDate: c.examDate ?? row.exam_date,
    schedule: Array.isArray(c.schedule) ? c.schedule : [],
  };
}

export default function PlansPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPlans() {
      try {
        const supabase = getSupabase();
        const { data, error: dbError } = await supabase
          .from("plans")
          .select("*")
          .order("created_at", { ascending: false });

        if (dbError) {
          if (!cancelled) {
            setError(
              "Failed to load saved plans. Make sure Supabase is configured."
            );
          }
          return;
        }

        if (!cancelled && data) {
          const mapped: StudyPlan[] = (data as SavedPlan[]).map(normalizePlan);
          setPlans(mapped);
        }
      } catch {
        if (!cancelled) {
          setError("Network error. Please check your connection and try again.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPlans();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 px-4 sm:px-6">
      <main className="w-full max-w-2xl py-8 sm:py-12 space-y-6 sm:space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Saved Study Plans
          </h1>
          <nav>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded"
            >
              <span aria-hidden="true">←</span>
              Back to planner
            </Link>
          </nav>
        </header>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-400">
            <Spinner className="h-5 w-5" />
            Loading saved plans…
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && plans.length === 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center space-y-4">
            <div className="text-4xl">📋</div>
            <p className="text-zinc-500">
              No study plans yet. Generate your first one!
            </p>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Create a Plan
            </Link>
          </div>
        )}

        {/* Plan cards */}
        {!isLoading && plans.length > 0 && (
          <div className="space-y-6">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id || plan.examDate + plan.courseName}
                plan={plan}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
