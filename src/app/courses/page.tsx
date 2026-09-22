import type { Metadata } from "next";
import Link from "next/link";
import { COURSES, type Course } from "@/data/courses";

export const metadata: Metadata = {
  title: "Courses — python2ai",
  description: "Hands-on courses covering the path from Python to AI engineering.",
};

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={`group flex flex-col rounded-[28px] p-3 transition-transform hover:-translate-y-1 sm:p-4 ${course.bg}`}
    >
      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl bg-[#141414]">
        <course.icon className={`h-20 w-20 sm:h-24 sm:w-24 ${course.iconColor}`} />
      </div>
      <h3 className="mt-5 font-heading text-lg uppercase tracking-tight text-black/90">
        {course.title}
      </h3>
      <p className="mt-2 font-quicksand text-sm font-medium leading-relaxed text-black/70">
        {course.description}
      </p>
    </Link>
  );
}

export default function CoursesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <p className="mb-3 font-mono text-sm text-muted">$ ls courses/</p>
        <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
          Courses to take you <span className="gradient-text">from Python to AI Engineer</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-quicksand text-base font-medium text-muted">
          Practical, project-driven courses — no fluff, just the skills that ship.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </main>
  );
}
