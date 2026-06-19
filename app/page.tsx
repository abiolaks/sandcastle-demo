export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white font-sans px-6">
      <main className="flex flex-col items-center gap-6 text-center max-w-2xl py-32">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
          PrepWise AI – Smart Study Planner
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-zinc-600">
          Enter your subject, topics, and exam date. Get a personalized
          AI-powered study schedule using spaced repetition and active recall.
        </p>
        <a
          href="/generate"
          className="flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          Get Started
        </a>
      </main>
    </div>
  );
}
