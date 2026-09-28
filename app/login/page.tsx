export default async function Login({ searchParams }: { searchParams: Promise<{ wrong?: string }> }) {
  const { wrong } = await searchParams;
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Bike Hunt</h1>
      <form method="post" action="/api/login" className="mt-6 flex flex-col gap-3">
        <input
          name="passcode"
          type="password"
          autoComplete="current-password"
          placeholder="Passcode"
          className="rounded-xl border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 text-base"
        />
        {wrong && <p className="text-sm text-[var(--warn)]">That passcode didn&apos;t match.</p>}
        <button className="rounded-xl bg-[var(--accent)] px-4 py-3 font-medium text-white dark:text-[var(--ground)]">
          Open
        </button>
      </form>
    </main>
  );
}
