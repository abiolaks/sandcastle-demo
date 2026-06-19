export interface ScheduleDay {
  day: number;
  date: string;
  topic: string;
  task: string;
  technique: string;
}

export interface StudyPlan {
  subject: string;
  topics: string;
  hoursPerDay: number;
  examDate: string;
  schedule: ScheduleDay[];
}

interface PlanCardProps {
  plan: StudyPlan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900">
          {plan.subject} Study Plan
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {plan.topics} · {plan.hoursPerDay}h/day · Exam: {plan.examDate}
        </p>
      </div>

      <div className="relative space-y-0">
        {plan.schedule.map((day, i) => (
          <div key={day.day} className="flex gap-4 pb-5">
            {/* Timeline line and dot */}
            <div className="relative flex flex-col items-center">
              <div
                className={`mt-1 h-3 w-3 rounded-full border-2 ${
                  i === 0
                    ? "border-indigo-500 bg-indigo-500"
                    : "border-zinc-300 bg-white"
                }`}
              />
              {i < plan.schedule.length - 1 && (
                <div className="mt-1 w-px flex-1 bg-zinc-200" />
              )}
            </div>

            {/* Day content */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-zinc-900">
                  Day {day.day}
                </span>
                <span className="text-xs text-zinc-400">{day.date}</span>
              </div>
              <h3 className="mt-0.5 text-sm font-semibold text-indigo-600">
                {day.topic}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                {day.task}
              </p>
              <span className="mt-1.5 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                {day.technique}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
