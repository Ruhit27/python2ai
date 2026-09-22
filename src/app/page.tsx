export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <p className="mb-4 font-mono text-sm text-muted">$ python -m ai_engineer --init</p>
      <h1 className="max-w-2xl font-heading text-4xl tracking-tight sm:text-5xl">
        Go from <span className="gradient-text">Python</span> to{" "}
        <span className="gradient-text">AI Engineer</span>
      </h1>
      <p className="mt-5 max-w-xl font-quicksand text-base font-medium text-muted sm:text-lg">
        SDKs, FastAPI, local models, agent harnesses, and Claude Code — the practical
        path from writing scripts to shipping AI systems.
      </p>
    </main>
  );
}
