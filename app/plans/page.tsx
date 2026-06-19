"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PlanCard, {
  type StudyPlan,
  type ScheduleDay,
} from "@/components/PlanCard";
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
          setError("Failed to load saved plans. Make sure Supabase is configured.");
          return;
        }

        if (!cancelled && data) {
          const mapped: StudyPlan[] = (data as SavedPlan[]).map((row) => ({
            id: row.id,
            subject: row.subject || row.plan_content.subject,
            topics: row.topics || row.plan_content.topics,
            hoursPerDay: row.hours_per_day || row.plan_content.hoursPerDay,
            examDate: row.exam_date || row.plan_content.examDate,
            schedule:
              row.plan_content.schedule ||
              (row.plan_content as unknown as ScheduleDay[]),
          }));
          setPlans(mapped);
        }
      } catch {
        setError("Network error. Please check your connection and try again.");
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
    <div className="flex flex-col flex-1 items-center bg-zinc-50 px-6">
      <main className="w-full max-w-2xl py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Saved Study Plans
          </h1>
          <Link
            href="/"
            className="inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ← Back to planner
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <p className="text-center text-sm text-zinc-500">
            Loading saved plans…
          </p>
        )}

        {/* Empty state */}
        {!isLoading && !error && plans.length === 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
            <p className="text-zinc-500">
              No study plans yet. Generate your first one!
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Create a Plan
            </Link>
          </div>
        )}

        {/* Plan cards */}
        {!isLoading && plans.length > 0 && (
          <div className="space-y-6">
            {plans.map((plan) => (
              <PlanCard key={plan.id || plan.examDate + plan.subject} plan={plan} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
