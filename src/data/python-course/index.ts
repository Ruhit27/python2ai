import type { CourseModule } from "@/data/courses";
import { guessTheNumberModule } from "./guess-the-number";
import { habitTrackerModule } from "./habit-tracker";
import { setupModule } from "./setup";
import { todoListModule } from "./todo-list";
import { weatherNowModule } from "./weather-now";
import { wordCounterModule } from "./word-counter";

export const pythonModules: CourseModule[] = [
  setupModule,
  guessTheNumberModule,
  todoListModule,
  wordCounterModule,
  weatherNowModule,
  habitTrackerModule,
];
