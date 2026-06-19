"use client";

import { type FormEvent, useState } from "react";

export interface StudyFormData {
  subject: string;
  topics: string;
  hoursPerDay: number;
  examDate: string;
}

interface StudyFormProps {
  onSubmit: (data: StudyFormData) => void;
  isLoading: boolean;
}

interface FieldErrors {
  subject?: string;
  topics?: string;
  hoursPerDay?: string;
  examDate?: string;
}

export default function StudyForm({ onSubmit, isLoading }: StudyFormProps) {
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [examDate, setExamDate] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(): boolean {
    const next: FieldErrors = {};

    if (!subject.trim()) {
      next.subject = "Subject is required.";
    }
    if (!topics.trim()) {
      next.topics = "Topics are required.";
    }
    const hours = Number(hoursPerDay);
    if (!hoursPerDay || Number.isNaN(hours) || hours < 1 || hours > 16) {
      next.hoursPerDay = "Enter a number between 1 and 16.";
    }
    if (!examDate) {
      next.examDate = "Exam date is required.";
    } else {
      const selected = new Date(examDate + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected <= today) {
        next.examDate = "Exam date must be in the future.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      subject: subject.trim(),
      topics: topics.trim(),
      hoursPerDay: Number(hoursPerDay),
      examDate,
    });
  }

  const inputClass = (field: keyof FieldErrors) =>
    `mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        : "border-zinc-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-zinc-700"
        >
          Subject
        </label>
        <input
          id="subject"
          type="text"
          className={inputClass("subject")}
          placeholder="e.g. Biology 101"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={isLoading}
        />
        {errors.subject && (
          <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="topics"
          className="block text-sm font-medium text-zinc-700"
        >
          Topics
        </label>
        <input
          id="topics"
          type="text"
          className={inputClass("topics")}
          placeholder="e.g. Cell structure, DNA replication, Photosynthesis"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          disabled={isLoading}
        />
        {errors.topics && (
          <p className="mt-1 text-xs text-red-500">{errors.topics}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="hoursPerDay"
            className="block text-sm font-medium text-zinc-700"
          >
            Hours per day
          </label>
          <input
            id="hoursPerDay"
            type="number"
            min={1}
            max={16}
            className={inputClass("hoursPerDay")}
            placeholder="3"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
            disabled={isLoading}
          />
          {errors.hoursPerDay && (
            <p className="mt-1 text-xs text-red-500">{errors.hoursPerDay}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="examDate"
            className="block text-sm font-medium text-zinc-700"
          >
            Exam date
          </label>
          <input
            id="examDate"
            type="date"
            className={inputClass("examDate")}
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            disabled={isLoading}
          />
          {errors.examDate && (
            <p className="mt-1 text-xs text-red-500">{errors.examDate}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isLoading ? "Generating..." : "Generate Plan"}
      </button>
    </form>
  );
}
