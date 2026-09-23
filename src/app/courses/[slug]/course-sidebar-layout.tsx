"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Confetti from "@/components/Confetti";
import {
  Sidebar001,
  Sidebar001Content,
  Sidebar001Footer,
  Sidebar001Group,
  Sidebar001Header,
  Sidebar001Item,
} from "@/components/ui/sidebar-001";
import { getCourse } from "@/data/courses";
import { renderLessonContent } from "@/lib/lesson-content";
import { useCourseProgress } from "@/lib/use-course-progress";

type Burst = { key: number; intensity: "small" | "large" };

export default function CourseSidebarLayout({ slug }: { slug: string }) {
  const course = getCourse(slug);
  const { done, hydrated, toggle, event } = useCourseProgress(course);
  const reduceMotion = useReducedMotion();
  const [picked, setPicked] = React.useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [burst, setBurst] = React.useState<Burst | null>(null);
  const [showComplete, setShowComplete] = React.useState(false);
  const advanceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const lessons = React.useMemo(
    () => course?.modules.flatMap((m) => m.lessons) ?? [],
    [course],
  );

  const cancelAdvance = React.useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  }, []);

  React.useEffect(() => cancelAdvance, [cancelAdvance]);

  React.useEffect(() => {
    if (!showComplete) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowComplete(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showComplete]);

  if (!course) return null;

  // Until the user picks a lesson, resume at the first one not yet done.
  const active =
    picked ??
    ((hydrated ? lessons.find((l) => !done.has(l.id)) : undefined) ?? lessons[0])
      ?.id ??
    "";
  const activeModule = course.modules.find((module) =>
    module.lessons.some((l) => l.id === active),
  );
  const activeLesson = activeModule?.lessons.find((l) => l.id === active);
  const isActiveDone = hydrated && done.has(active);
  const animateBar = event !== null && !reduceMotion;

  const selectLesson = (id: string) => {
    cancelAdvance();
    setPicked(id);
  };

  const handleToggle = () => {
    if (!activeLesson) return;
    cancelAdvance();
    setPicked(active);
    const result = toggle(active);
    if (!result?.becameDone) return;

    if (result.courseCompleted) {
      if (!reduceMotion) {
        setShowComplete(true);
        setBurst({ key: Date.now(), intensity: "large" });
      }
      return;
    }
    if (result.moduleCompleted && !reduceMotion) {
      setBurst({ key: Date.now(), intensity: "small" });
    }

    const next = lessons[lessons.findIndex((l) => l.id === active) + 1];
    if (next) {
      const delay = reduceMotion ? 300 : result.moduleCompleted ? 2500 : 1200;
      advanceTimer.current = setTimeout(() => setPicked(next.id), delay);
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            key="course-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 272, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            className="h-full shrink-0 overflow-hidden"
          >
            <Sidebar001
              className="w-68 border-r border-border/50"
              defaultWidth={272}
            >
              <Sidebar001Header>
                <Link href="/courses" className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#141414]">
                    <course.icon className={`h-4 w-4 ${course.iconColor}`} />
                  </span>
                  <span className="text-base font-semibold text-foreground">
                    {course.title}
                  </span>
                </Link>
              </Sidebar001Header>
              <Sidebar001Content>
                {course.modules.map((module) => {
                  const moduleDone = hydrated
                    ? module.lessons.filter((l) => done.has(l.id)).length
                    : 0;
                  const moduleComplete = moduleDone === module.lessons.length;
                  return (
                    <Sidebar001Group
                      key={module.title}
                      label={
                        <span className="flex items-center gap-2">
                          <span>{module.title}</span>
                          <span
                            className="ml-auto flex items-center gap-1 font-mono text-[10px]"
                            style={
                              moduleComplete ? { color: course.accent } : undefined
                            }
                          >
                            {moduleComplete ? (
                              <>
                                <Check className="size-3" />
                                Done
                              </>
                            ) : (
                              `${moduleDone}/${module.lessons.length}`
                            )}
                          </span>
                        </span>
                      }
                      defaultOpen={module.lessons.some((l) => l.id === active)}
                    >
                      {module.lessons.map((lesson) => (
                        <Sidebar001Item
                          key={lesson.id}
                          href={`#${lesson.id}`}
                          label={lesson.title}
                          isActive={active === lesson.id}
                          isDone={hydrated && done.has(lesson.id)}
                          onClick={(e) => {
                            e.preventDefault();
                            selectLesson(lesson.id);
                          }}
                        />
                      ))}
                    </Sidebar001Group>
                  );
                })}
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

      <motion.button
        type="button"
        onClick={() => setIsSidebarOpen((open) => !open)}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isSidebarOpen}
        initial={false}
        animate={{ left: isSidebarOpen ? 272 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 38 }}
        className="absolute top-1/2 z-30 -mt-7 flex h-14 w-5 items-center justify-center rounded-r-lg border border-l-0 border-border/50 bg-surface text-foreground/40 transition-colors hover:text-foreground/80"
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </motion.button>

      <div className="relative flex-1 overflow-y-auto no-scrollbar">
        <div className="sticky top-0 z-20 flex items-center gap-3 bg-background/80 px-6 py-3 backdrop-blur sm:px-10">
          <div
            className="flex flex-1 gap-1"
            role="progressbar"
            aria-label={`${course.title} progress`}
            aria-valuemin={0}
            aria-valuemax={lessons.length}
            aria-valuenow={hydrated ? lessons.filter((l) => done.has(l.id)).length : 0}
          >
            {course.modules.map((module) => {
              const count = hydrated
                ? module.lessons.filter((l) => done.has(l.id)).length
                : 0;
              return (
                <div
                  key={module.title}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/10"
                  title={module.title}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: course.accent }}
                    initial={false}
                    animate={{ width: `${(count / module.lessons.length) * 100}%` }}
                    transition={
                      animateBar
                        ? { type: "spring", stiffness: 140, damping: 22 }
                        : { duration: 0 }
                    }
                  />
                </div>
              );
            })}
          </div>
          <span className="font-mono text-xs text-muted/70">
            {hydrated ? lessons.filter((l) => done.has(l.id)).length : 0}/
            {lessons.length}
          </span>
        </div>

        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full opacity-[0.12] blur-[100px]"
          style={{ background: course.accent }}
        />

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
              $ open {course.slug}/{active}.md
            </p>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              {activeModule && (
                <span
                  className="inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-medium"
                  style={{
                    borderColor: `${course.accent}40`,
                    color: course.accent,
                    backgroundColor: `${course.accent}14`,
                  }}
                >
                  {activeModule.title}
                </span>
              )}
              <button
                type="button"
                role="switch"
                aria-checked={isActiveDone}
                onClick={handleToggle}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-medium transition-colors"
                style={{
                  borderColor: isActiveDone
                    ? course.accent
                    : "var(--border)",
                  color: isActiveDone ? course.accent : "var(--muted)",
                  backgroundColor: isActiveDone
                    ? `${course.accent}14`
                    : "transparent",
                }}
              >
                <span
                  className="flex size-4 items-center justify-center rounded-full border"
                  style={{
                    borderColor: isActiveDone ? course.accent : "currentColor",
                    backgroundColor: isActiveDone ? course.accent : "transparent",
                  }}
                >
                  {isActiveDone && (
                    <motion.span
                      key={event?.seq ?? 0}
                      initial={event?.id === active && !reduceMotion ? { scale: 0.3 } : false}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 14 }}
                      className="flex text-black"
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </motion.span>
                  )}
                </span>
                {isActiveDone ? "Done" : "Mark as done"}
              </button>
            </div>

            <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
              {activeLesson?.title}
            </h1>

            {activeLesson?.content ? (
              <>
                <div className="mt-2">
                  {renderLessonContent(activeLesson.content, course.accent)}
                </div>
                {activeLesson.extra && (
                  <div className="mt-2">{activeLesson.extra}</div>
                )}
              </>
            ) : (
              <>
                <p className="mt-4 max-w-xl font-quicksand text-base font-medium text-muted">
                  {course.description}
                </p>

                <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
                  <p className="text-sm text-muted">
                    Lesson content is coming soon. This page is wired up to the
                    full <span className="text-foreground">{course.title}</span>{" "}
                    curriculum in the sidebar — pick any lesson to preview
                    navigation.
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

      {burst && (
        <Confetti
          key={burst.key}
          intensity={burst.intensity}
          accent={course.accent}
          onDone={() => setBurst(null)}
        />
      )}

      <AnimatePresence>
        {showComplete && (
          <motion.div
            key="course-complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-background/85 px-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Course complete"
          >
            <motion.div
              initial={{ scale: 0.92, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="max-w-md rounded-2xl border border-border bg-surface p-8 text-center"
            >
              <span
                className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full"
                style={{ backgroundColor: course.accent }}
              >
                <Check className="size-6 text-black" strokeWidth={3} />
              </span>
              <h2 className="font-heading text-2xl tracking-tight">
                Course complete
              </h2>
              <p className="mt-2 font-quicksand text-sm font-medium text-muted">
                You finished all {lessons.length} lessons of {course.title}.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  href="/courses"
                  className="rounded-full px-4 py-2 text-sm font-medium text-black"
                  style={{ backgroundColor: course.accent }}
                >
                  Back to courses
                </Link>
                <button
                  type="button"
                  onClick={() => setShowComplete(false)}
                  className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
