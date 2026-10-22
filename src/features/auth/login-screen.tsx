"use client";

import { Eye, EyeSlash, LockSimple } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { readSession, writeSession } from "@/lib/session";
import { signedInUser } from "@/features/dashboard/mock/staff.sample";

const PREVIEW_EMAIL = "adi@test.com";
const PREVIEW_PASSWORD = "test1234";

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (readSession()) router.replace("/dashboard");
  }, [router]);

  function signIn(nextEmail: string, nextPassword: string) {
    setError("");
    const normalised = nextEmail.trim().toLowerCase();
    if (normalised !== PREVIEW_EMAIL || nextPassword !== PREVIEW_PASSWORD) {
      setError("Use adi@test.com and test1234.");
      return;
    }
    setPending(true);
    writeSession({
      name: signedInUser.name,
      email: PREVIEW_EMAIL,
      title: signedInUser.title,
    });
    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-[100dvh] lg:grid-cols-2">
      <section className="flex flex-col px-5 py-6 sm:px-10 lg:px-14 lg:pt-10">
        <BrandLogo className="h-12 w-auto" />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-3xl leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            Welcome <span className="italic">back.</span>
          </h1>
          <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-[var(--muted)]">
            Accounts are created by an admin. Use your ITCraft work email.
          </p>
          <form
            className="mt-8 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              signIn(email, password);
            }}
          >
            <label className="grid gap-2 text-sm">
              Work email
              <input
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="adi@test.com"
                className="h-11 rounded-[8px] border border-[var(--input-line)] bg-[var(--surface-2)] px-3 text-[var(--ink)]"
              />
            </label>
            <div className="grid gap-2 text-sm">
              <label htmlFor="password">Password</label>
              <span className="relative">
                <LockSimple className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  className="h-11 w-full rounded-[8px] border border-[var(--input-line)] bg-[var(--surface-2)] pr-11 pl-10 text-[var(--ink)]"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-[8px]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeSlash aria-hidden /> : <Eye aria-hidden />}
                </button>
              </span>
              <span className="text-sm text-[var(--muted)]">Preview: adi@test.com / test1234</span>
            </div>
            {error ? (
              <p className="text-sm text-[var(--bad)]" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className="h-11 rounded-[8px] bg-[var(--button-bg)] text-sm font-medium text-[var(--button-ink)] active:translate-y-px disabled:opacity-70"
            >
              {pending ? "Signing in" : "Sign in"}
            </button>
            <button
              type="button"
              className="h-11 rounded-[8px] border border-[var(--line)] text-sm active:translate-y-px"
              onClick={() => signIn(PREVIEW_EMAIL, PREVIEW_PASSWORD)}
            >
              Preview as admin
            </button>
          </form>
        </div>
        <p className="text-sm text-[var(--muted)]">ITCraft</p>
      </section>
      <section className="hero-wash relative hidden min-h-[100dvh] flex-col justify-center px-10 py-16 text-[var(--ink)] lg:flex xl:px-16">
        <p className="text-sm text-[var(--muted)]">Project One</p>
        <h2 className="mt-4 max-w-[12ch] font-display text-5xl leading-[1.1] tracking-tight xl:text-6xl">
          Order. Configure. <span className="italic">Prove.</span>
        </h2>
        <p className="mt-4 max-w-[36ch] text-base leading-relaxed text-[var(--muted)]">
          A purchase order becomes a configured build, then a checked completion certificate.
        </p>
        <ol className="mt-10 max-w-md divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {[
            ["Intake", "Capture the order"],
            ["Kick-off", "Confirm the purpose"],
            ["Planning", "Build the checklist"],
            ["Execution", "Do the field work"],
            ["Closure", "Sign the completion certificate"],
          ].map(([label, detail], index) => (
            <li key={label} className="flex items-baseline justify-between gap-6 py-3">
              <span className="font-mono text-xs text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
              <span className="flex-1 font-medium">{label}</span>
              <span className="text-sm text-[var(--muted)]">{detail}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
