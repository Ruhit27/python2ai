"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { PanelLeft } from "lucide-react";
import {
  Sidebar001,
  Sidebar001Content,
  Sidebar001Footer,
  Sidebar001Header,
  Sidebar001Item,
  Sidebar001Section,
} from "@/components/ui/sidebar-001";
import { getCourse } from "@/data/courses";
import { renderLessonContent } from "@/lib/lesson-content";

export default function CourseSidebarLayout({ slug }: { slug: string }) {
  const course = getCourse(slug);
  const [active, setActive] = React.useState(course?.modules[0]?.lessons[0]?.title ?? "");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  if (!course) return null;

  const activeModule = course.modules.find((module) => module.lessons.some((l) => l.title === active));
  const activeLesson = activeModule?.lessons.find((l) => l.title === active);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            key="course-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 272, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            className="h-full overflow-hidden"
          >
            <Sidebar001 className="border-r border-border/50 w-68" defaultWidth={272}>
              <Sidebar001Header>
                <div className="flex items-center justify-between gap-2">
                  <Link href="/courses" className="flex items-center gap-2 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#141414]">
                      <course.icon className={`h-4 w-4 ${course.iconColor}`} />
                    </span>
                    <span className="truncate text-base font-semibold text-foreground">
                      {course.title}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close sidebar"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/80"
                  >
                    <PanelLeft className="h-4 w-4" />
                  </button>
                </div>
              </Sidebar001Header>
              <Sidebar001Content>
                {course.modules.map((module) => (
                  <Sidebar001Section key={module.title} label={module.title}>
                    {module.lessons.map((lesson) => (
                      <Sidebar001Item
                        key={lesson.title}
                        href={`#${lesson.title}`}
                        label={lesson.title}
                        isActive={active === lesson.title}
                        onClick={(e) => {
                          e.preventDefault();
                          setActive(lesson.title);
                        }}
                      />
                    ))}
                  </Sidebar001Section>
                ))}
              </Sidebar001Content>
              <Sidebar001Footer>
                <Link
                  href="/courses"
                  className="text-xs text-foreground/40 transition-colors hover:text-foreground/70"
                >
                  ← All courses
                </Link>
              </Sidebar001Footer>
            </Sidebar001>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex-1 overflow-y-auto no-scrollbar">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-160 -translate-x-1/2 rounded-full opacity-[0.12] blur-[100px]"
          style={{ background: course.accent }}
        />

        {!isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
            className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-border/50 bg-surface text-foreground/50 transition-colors hover:text-foreground/80"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative mx-auto max-w-2xl px-6 py-14 sm:px-10"
          >
            <p className="mb-4 font-mono text-xs text-muted/70">
              $ open {course.slug}/{active.toLowerCase().replace(/\s+/g, "-")}.md
            </p>

            {activeModule && (
              <span
                className="mb-4 inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-medium"
                style={{
                  borderColor: `${course.accent}40`,
                  color: course.accent,
                  backgroundColor: `${course.accent}14`,
                }}
              >
                {activeModule.title}
              </span>
            )}

            <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">{active}</h1>

            {activeLesson?.content ? (
              <>
                <div className="mt-2">{renderLessonContent(activeLesson.content, course.accent)}</div>
                {activeLesson.extra && <div className="mt-2">{activeLesson.extra}</div>}
              </>
            ) : (
              <>
                <p className="mt-4 max-w-xl font-quicksand text-base font-medium text-muted">
                  {course.description}
                </p>

                <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
                  <p className="text-sm text-muted">
                    Lesson content is coming soon. This page is wired up to the full{" "}
                    <span className="text-foreground">{course.title}</span> curriculum in the
                    sidebar — pick any lesson to preview navigation.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <div className="h-3 w-full rounded bg-foreground/6" />
                  <div className="h-3 w-5/6 rounded bg-foreground/6" />
                  <div className="h-3 w-4/6 rounded bg-foreground/6" />
                </div>
                <div className="mt-4 h-40 w-full rounded-lg bg-foreground/5" />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
