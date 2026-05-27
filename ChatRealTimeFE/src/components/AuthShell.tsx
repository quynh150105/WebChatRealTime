export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-8">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950">ChatRealTime</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue your conversations.</p>
        </div>
        {children}
      </section>
    </main>
  );
}
