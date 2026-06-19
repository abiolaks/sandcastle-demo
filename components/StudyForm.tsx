"use client";

import { type FormEvent, useState } from "react";
import Spinner from "@/components/Spinner";

export interface StudyFormData {
  courseName: string;
  hoursPerDay: number;
  examDate: string;
}

interface StudyFormProps {
  onSubmit: (data: StudyFormData) => void;
  isLoading: boolean;
}

interface FieldErrors {
  courseName?: string;
  hoursPerDay?: string;
  examDate?: string;
}

export default function StudyForm({ onSubmit, isLoading }: StudyFormProps) {
  const [courseName, setCourseName] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [examDate, setExamDate] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(): boolean {
    const next: FieldErrors = {};

    if (!courseName.trim()) {
      next.courseName = "Course name is required.";
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
      courseName: courseName.trim(),
      hoursPerDay: Number(hoursPerDay),
      examDate,
    });
  }

  const inputClass = (field: keyof FieldErrors) =>
    `mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
        : "border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="courseName"
          className="block text-sm font-medium text-zinc-700"
        >
          Course Name
        </label>
        <input
          id="courseName"
          type="text"
          className={inputClass("courseName")}
          placeholder='e.g. "CS 101: Introduction to Computer Science"'
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          disabled={isLoading}
        />
        {errors.courseName && (
          <p className="mt-1 text-xs text-red-500">{errors.courseName}</p>
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
        className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {isLoading ? "Generating…" : "Generate Plan"}
      </button>
    </form>
  );
}
