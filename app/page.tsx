"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Container,
  CreditCard,
  Database,
  Droplets,
  Feather,
  GitBranch,
  Globe,
  Layers,
  Leaf,
  Lock,
  Mail,
  Network,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Triangle,
  Wallet,
  Webhook,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

type Option = {
  id: string;

  label: string;

  short: string;

  description: string;

  badge?: string;

  icon: LucideIcon;
};

type Step = {
  key: string;

  title: string;

  subtitle: string;

  icon: LucideIcon;

  options: Option[];
};

const STEPS: Step[] = [
  {
    key: "frontend",

    title: "Frontend Framework",

    subtitle: "How your users will experience your product.",

    icon: Layers,

    options: [
      {
        id: "nextjs",

        label: "Next.js (App Router)",

        short: "Next.js",

        description:
          "Server components, streaming, SEO-ready routing and edge-friendly rendering out of the box.",

        badge: "Most popular",

        icon: Globe,
      },

      {
        id: "vite",

        label: "React + Vite",

        short: "React + Vite",

        description:
          "Lightning-fast SPA tooling with instant HMR. Ideal for dashboards and app-first products.",

        icon: Zap,
      },
    ],
  },

  {
    key: "backend",

    title: "Backend Architecture",

    subtitle: "The engine that powers your API and business logic.",

    icon: Server,

    options: [
      {
        id: "nestjs",

        label: "NestJS (Structured)",

        short: "NestJS",

        description:
          "Opinionated modules, dependency injection and decorators. Built for teams and long-term scale.",

        badge: "Enterprise-ready",

        icon: Network,
      },

      {
        id: "express",

        label: "ExpressJS (Minimalist)",

        short: "Express",

        description:
          "Lean, flexible and unopinionated. Total control with a tiny footprint and zero magic.",

        icon: Feather,
      },
    ],
  },

  {
    key: "database",

    title: "Database & ORM",

    subtitle: "Where your data lives and how you talk to it.",

    icon: Database,

    options: [
      {
        id: "pg-prisma",

        label: "PostgreSQL + Prisma",

        short: "Prisma + Postgres",

        description:
          "Best-in-class developer experience with a type-safe client and painless migrations.",

        badge: "Recommended",

        icon: Database,
      },

      {
        id: "pg-drizzle",

        label: "PostgreSQL + Drizzle",

        short: "Drizzle + Postgres",

        description:
          "SQL-first, lightweight and blazing fast. Schema in TypeScript with zero runtime bloat.",

        icon: Database,
      },

      {
        id: "mongo-mongoose",

        label: "MongoDB + Mongoose",

        short: "Mongoose + MongoDB",

        description:
          "Flexible document modeling with schemas and validation for rapidly evolving products.",

        icon: Leaf,
      },
    ],
  },

  {
    key: "billing",

    title: "Billing & Payments",

    subtitle: "How you get paid, wired up end to end.",

    icon: CreditCard,

    options: [
      {
        id: "stripe",

        label: "Stripe",

        short: "Stripe",

        description:
          "Subscriptions, usage billing, customer portal and a rock-solid webhook pipeline.",

        badge: "Industry standard",

        icon: CreditCard,
      },

      {
        id: "lemonsqueezy",

        label: "Lemon Squeezy",

        short: "Lemon Squeezy",

        description:
          "Merchant of record that handles global sales tax and VAT for you, so you never have to.",

        icon: Wallet,
      },
    ],
  },

  {
    key: "infra",

    title: "Infrastructure & DevOps",

    subtitle: "Where your codebase ships to production.",

    icon: Cloud,

    options: [
      {
        id: "aws",

        label: "AWS (ECS/Docker)",

        short: "AWS",

        description:
          "Containerized services on ECS with a battle-tested path to serious scale.",

        icon: Cloud,
      },

      {
        id: "digitalocean",

        label: "DigitalOcean (Droplet/Docker)",

        short: "DigitalOcean",

        description:
          "Simple, predictable pricing. Docker Compose on a Droplet with zero cloud-console headaches.",

        badge: "Budget friendly",

        icon: Droplets,
      },

      {
        id: "vercel-supabase",

        label: "Vercel + Supabase",

        short: "Vercel + Supabase",

        description:
          "Fully managed edge hosting and backend services. Ship today, think about servers never.",

        icon: Triangle,
      },
    ],
  },
];

const INCLUDED = [
  {
    icon: Lock,

    title: "Pre-built JWT Auth",

    body: "Sign up, login, refresh-token rotation, password reset and role-based guards, already wired into your chosen frontend and backend.",
  },

  {
    icon: Webhook,

    title: "Fully wired Payment Webhooks",

    body: "Signature-verified webhook handlers that sync subscriptions, invoices and entitlements to your database automatically.",
  },

  {
    icon: Container,

    title: "docker-compose orchestration",

    body: "One command spins up your app, API, database and supporting services locally, mirroring production.",
  },

  {
    icon: GitBranch,

    title: "Automated GitHub Actions CI/CD",

    body: "Lint, test, build and deploy pipelines pre-configured for your selected infrastructure target.",
  },
];

const FAQS = [
  {
    q: "Is this a template or generated code?",

    a: "Your exact stack combination is assembled from tested, composable modules, so you receive a single coherent repository rather than a pile of mismatched snippets.",
  },

  {
    q: "Do I own the code?",

    a: "Yes. You receive the full source with a commercial license. Use it for unlimited personal and client projects with no attribution required.",
  },

  {
    q: "What if my stack combination isn't ready yet?",

    a: "We compile combinations in order of demand. Join the queue with your configuration and you will be notified the moment your exact stack goes live.",
  },

  {
    q: "How does the early-bird discount work?",

    a: "Everyone who saves a configuration is bumped up the queue and locked in for 50% off at launch. No payment is taken today.",
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Page() {
  const [stepIndex, setStepIndex] = useState(0);

  const [selections, setSelections] = useState<Record<string, string>>({});

  const [modalOpen, setModalOpen] = useState(false);

  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isSummary = stepIndex >= STEPS.length;

  const currentStep = isSummary ? null : STEPS[stepIndex];

  const currentSelection = currentStep
    ? selections[currentStep.key]
    : undefined;

  const selectedOptions = useMemo(
    () =>
      STEPS.map((step) => ({
        step,

        option: step.options.find((o) => o.id === selections[step.key]),
      })),

    [selections],
  );

  const stackName = selectedOptions

    .map(({ option }) => option?.short)

    .filter(Boolean)

    .join(" + ");

  useEffect(() => {
    if (!modalOpen) return;

    const previous = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;

      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  const selectOption = (id: string) => {
    if (!currentStep) return;

    setSelections((prev) => ({ ...prev, [currentStep.key]: id }));
  };

  const goNext = () => {
    if (!currentSelection) return;

    setStepIndex((i) => i + 1);
  };

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  const restart = () => {
    setSelections({});

    setStepIndex(0);

    setSubmitted(false);

    setEmail("");

    setEmailError("");
  };

  const openModal = () => {
    setSubmitted(false);

    setEmailError("");

    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    const value = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(value)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setEmailError("");
    setSubmitError("");

    try {
      const { error } = await supabase.from("leads").insert({
        email: value,
        stack_configuration: selections,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Failed to save lead:", error);
        setSubmitError(
          "We couldn't save your configuration. Please try again.",
        );
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Unexpected lead submission error:", error);
      setSubmitError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToConfigurator = () => {
    document

      .getElementById("configurator")

      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/40">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />

        <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="absolute bottom-0 -left-40 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/40">
              <Terminal className="h-5 w-5 text-white" />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              StackForge
            </span>
          </div>

          <button
            onClick={scrollToConfigurator}
            className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-500/60 hover:text-white"
          >
            Build my stack
          </button>
        </header>

        <section className="mx-auto max-w-4xl px-6 pb-16 pt-12 text-center sm:pt-20">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            Private beta &middot; Multi-stack SaaS blueprints
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Stop wrestling with configuration.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Generate your exact full-stack SaaS blueprint in 60 seconds.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Traditional boilerplates force you into rigid stacks. Pick your
            favorite frontend, backend, ORM, database, payment provider, and
            deployment target. Get a production-ready, dockerized codebase
            engineered to scale.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={scrollToConfigurator}
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-900/50 transition hover:bg-indigo-500"
            >
              Configure your stack
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>

            <span className="text-sm text-slate-500">
              5 quick choices &middot; no signup required
            </span>
          </div>
        </section>

        <section
          id="configurator"
          className="mx-auto max-w-5xl scroll-mt-8 px-6 pb-24"
        >
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />

                <span className="h-3 w-3 rounded-full bg-amber-400/80" />

                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>

              <span className="font-mono text-xs text-slate-500">
                stackforge configure --interactive
              </span>

              <span className="w-12" />
            </div>

            <div className="border-b border-slate-800 px-5 py-5 sm:px-8">
              <ol className="flex items-center justify-between gap-2">
                {STEPS.map((step, i) => {
                  const done = i < stepIndex;

                  const active = i === stepIndex;

                  return (
                    <li
                      key={step.key}
                      className="flex flex-1 items-center gap-2"
                    >
                      <button
                        type="button"
                        disabled={!done}
                        onClick={() => setStepIndex(i)}
                        aria-label={`Step ${i + 1}: ${step.title}`}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition ${
                          done
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                            : active
                              ? "border-indigo-500 bg-indigo-500/20 text-indigo-300 ring-4 ring-indigo-500/10"
                              : "border-slate-700 bg-slate-900 text-slate-500"
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" /> : i + 1}
                      </button>

                      <span
                        className={`hidden text-xs font-medium lg:block ${
                          active
                            ? "text-slate-200"
                            : done
                              ? "text-slate-400"
                              : "text-slate-600"
                        }`}
                      >
                        {step.title.split(" ")[0]}
                      </span>

                      {i < STEPS.length - 1 && (
                        <div
                          className={`h-px flex-1 transition-colors ${
                            done ? "bg-emerald-500/50" : "bg-slate-800"
                          }`}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="px-5 py-8 sm:px-8">
              {currentStep && (
                <div key={currentStep.key}>
                  <div className="mb-8 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                      <currentStep.icon className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                        Step {stepIndex + 1} of {STEPS.length}
                      </p>

                      <h2 className="mt-1 text-2xl font-bold tracking-tight">
                        {currentStep.title}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        {currentStep.subtitle}
                      </p>
                    </div>
                  </div>

                  <div
                    role="radiogroup"
                    aria-label={currentStep.title}
                    className={`grid gap-4 ${
                      currentStep.options.length === 2
                        ? "sm:grid-cols-2"
                        : "sm:grid-cols-3"
                    }`}
                  >
                    {currentStep.options.map((option) => {
                      const selected = currentSelection === option.id;

                      const Icon = option.icon;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => selectOption(option.id)}
                          className={`group relative flex flex-col items-start rounded-xl border-2 p-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                            selected
                              ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-900/30"
                              : "border-slate-800 bg-slate-900 hover:border-slate-600 hover:bg-slate-800/60"
                          }`}
                        >
                          <div className="mb-4 flex w-full items-start justify-between">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
                                selected
                                  ? "bg-indigo-500 text-white"
                                  : "bg-slate-800 text-slate-300 group-hover:text-white"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>

                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                                selected
                                  ? "border-indigo-500 bg-indigo-500"
                                  : "border-slate-600"
                              }`}
                            >
                              {selected && (
                                <Check className="h-3.5 w-3.5 text-white" />
                              )}
                            </div>
                          </div>

                          <h3 className="text-base font-semibold text-slate-100">
                            {option.label}
                          </h3>

                          <p className="mt-2 text-sm leading-relaxed text-slate-400">
                            {option.description}
                          </p>

                          {option.badge && (
                            <span className="mt-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                              {option.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={stepIndex === 0}
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!currentSelection}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none"
                    >
                      {stepIndex === STEPS.length - 1
                        ? "Review my stack"
                        : "Continue"}

                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {isSummary && (
                <div>
                  <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                      Configuration complete
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                      Your <span className="text-indigo-300">{stackName}</span>{" "}
                      Stack is Ready!
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
                      Here is the exact blueprint we will compile for you.
                      Review your choices, then generate your codebase.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60">
                    <ul className="divide-y divide-slate-800">
                      {selectedOptions.map(({ step, option }, i) => {
                        if (!option) return null;

                        const Icon = option.icon;

                        return (
                          <li
                            key={step.key}
                            className="flex items-center justify-between gap-4 px-5 py-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                                <Icon className="h-5 w-5" />
                              </div>

                              <div>
                                <p className="text-xs uppercase tracking-wider text-slate-500">
                                  {step.title}
                                </p>

                                <p className="font-semibold text-slate-100">
                                  {option.label}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setStepIndex(i)}
                              className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
                            >
                              Change
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      "Dockerized and CI/CD ready",

                      "Auth and payments pre-wired",

                      "Full source, commercial license",

                      "Lifetime updates for your stack",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-sm text-slate-300"
                      >
                        <Check className="h-4 w-4 shrink-0 text-emerald-400" />

                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col items-center gap-4">
                    <button
                      type="button"
                      onClick={openModal}
                      className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-900/50 transition hover:from-indigo-500 hover:to-violet-500 sm:w-auto"
                    >
                      <Rocket className="h-5 w-5" />
                      Generate Production-Ready Codebase &mdash; $79
                      <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                    </button>

                    <button
                      type="button"
                      onClick={restart}
                      className="text-sm text-slate-500 transition hover:text-slate-300"
                    >
                      Start over
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              What is actually in the box
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Real, working code. Not a skeleton.
            </h2>

            <p className="mt-4 text-slate-400">
              Every blueprint ships with the unglamorous infrastructure you
              would otherwise spend weeks building.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-indigo-500/40 hover:bg-slate-900"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-300">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-semibold text-slate-100">{title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-24">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
            Frequently asked questions
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;

              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60"
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-medium text-slate-100">{faq.q}</span>

                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {open && (
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-600">
          &copy; 2026 StackForge. Built for developers who ship.
        </footer>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="queue-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/60"
          >
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400" />

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-5 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-7 sm:p-8">
              {!submitted ? (
                <>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                    <Sparkles className="h-6 w-6" />
                  </div>

                  <h3
                    id="queue-title"
                    className="text-2xl font-bold tracking-tight"
                  >
                    Wow, thank you!
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    Our automated custom configuration engine is currently in
                    private beta. We are compiling codebases in the exact order
                    of market demand. Enter your email below to save your
                    configuration, get bumped to the front of the queue, and
                    lock in a 50% early-bird discount the moment your specific
                    stack combination goes live this week!
                  </p>

                  <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Your saved stack
                    </p>

                    <p className="mt-1 text-sm font-medium text-indigo-300">
                      {stackName}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="mt-6">
                    <label
                      htmlFor="waitlist-email"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <input
                        id="waitlist-email"
                        type="email"
                        autoFocus
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);

                          if (emailError) setEmailError("");
                        }}
                        placeholder="you\@company.com"
                        aria-invalid={emailError ? true : undefined}
                        aria-describedby={
                          emailError ? "waitlist-email-error" : undefined
                        }
                        className={`w-full rounded-lg border bg-slate-950 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:ring-2 ${
                          emailError
                            ? "border-rose-500/70 focus:ring-rose-500/30"
                            : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30"
                        }`}
                      />
                    </div>

                    {emailError && (
                      <p
                        id="waitlist-email-error"
                        className="mt-2 text-sm text-rose-400"
                      >
                        {emailError}
                      </p>
                    )}

                    {submitError && (
                      <p role="alert" className="mt-2 text-sm text-rose-400">
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Saving..." : "Join the Queue"}

                      {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                    </button>

                    <p className="mt-3 text-center text-xs text-slate-600">
                      No payment today. No spam. Unsubscribe anytime.
                    </p>
                  </form>
                </>
              ) : (
                <div className="py-4 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>

                  <h3 id="queue-title" className="text-2xl font-bold">
                    You&apos;re in the queue!
                  </h3>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
                    We saved your{" "}
                    <span className="font-medium text-indigo-300">
                      {stackName}
                    </span>{" "}
                    configuration. We&apos;ll email{" "}
                    <span className="font-medium text-slate-200">
                      {email.trim()}
                    </span>{" "}
                    with your 50% early-bird discount the moment it goes live.
                  </p>

                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="mt-6 rounded-lg border border-slate-700 bg-slate-800 px-6 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
