"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Courses", href: "/courses" },
  { label: "Cheatsheets", href: "/cheatsheets" },
  { label: "Glossary", href: "/ai-glossary" },
  { label: "Agentic OS", href: "/agentic-os" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Full-screen pages with their own home button.
  if (pathname === "/ai-glossary" || pathname === "/agentic-os") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
        <div className="flex items-center">
          <Logo />
        </div>

        <ul className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center justify-self-end md:flex">
          <Link
            href="/login"
            className="rounded-full border border-border px-4 py-1.5 font-sans text-sm font-bold text-foreground transition-colors hover:border-accent-via/60 hover:bg-surface"
          >
            Login
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="col-start-3 flex h-9 w-9 items-center justify-center justify-self-end rounded-md text-foreground md:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M4 4l12 12M16 4L4 16" />
            ) : (
              <path d="M2.5 5h15M2.5 10h15M2.5 15h15" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm font-medium text-muted hover:bg-surface hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-border pt-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-2.5 font-sans text-sm font-bold text-foreground hover:bg-surface"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
