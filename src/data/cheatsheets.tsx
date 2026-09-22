import type { ComponentType, SVGProps } from "react";
import { PythonIcon } from "@/components/icons/BrandIcons";

export type CheatsheetItem = {
  n: number;
  name: string;
  purpose: string;
  example: string;
};

export type Cheatsheet = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  bg: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconColor: string;
  items: CheatsheetItem[];
};

export const CHEATSHEETS: Cheatsheet[] = [
  {
    slug: "17-python-functions-for-beginners",
    title: "17 Python Functions for Beginners",
    subtitle: "Small functions, big impact — master the basics.",
    description: "The 17 built-in functions every beginner reaches for first.",
    bg: "bg-[#FFD43B]",
    icon: PythonIcon,
    iconColor: "text-[#4B8BBE]",
    items: [
      { n: 1, name: "print()", purpose: "Display output on the screen.", example: 'print("Hello, Python!")' },
      { n: 2, name: "input()", purpose: "Take input from user.", example: 'name = input("Name: ")' },
      { n: 3, name: "len()", purpose: "Return the number of items/characters.", example: 'len("Python") # 6' },
      { n: 4, name: "type()", purpose: "Return the data type of a value.", example: "type(10) # <class 'int'>" },
      { n: 5, name: "int()", purpose: "Convert value to integer.", example: 'int("25") # 25' },
      { n: 6, name: "float()", purpose: "Convert value to floating point.", example: 'float("3.14") # 3.14' },
      { n: 7, name: "str()", purpose: "Convert value to string.", example: 'str(100) # "100"' },
      { n: 8, name: "list()", purpose: "Create a list from an iterable.", example: "list(\"abc\") # ['a','b','c']" },
      { n: 9, name: "range()", purpose: "Generate a sequence of numbers.", example: "range(1, 6) # 1 to 5" },
      { n: 10, name: "sum()", purpose: "Return the sum of all numbers.", example: "sum([1, 2, 3]) # 6" },
      { n: 11, name: "max()", purpose: "Return the largest value.", example: "max(5, 2, 9) # 9" },
      { n: 12, name: "min()", purpose: "Return the smallest value.", example: "min(5, 2, 9) # 2" },
      { n: 13, name: "sorted()", purpose: "Return a sorted list.", example: "sorted([3, 1, 2]) # [1, 2, 3]" },
      { n: 14, name: "abs()", purpose: "Return the absolute value.", example: "abs(-10) # 10" },
      { n: 15, name: "round()", purpose: "Round to nearest integer.", example: "round(3.78) # 4" },
      {
        n: 16,
        name: "enumerate()",
        purpose: "Return index and value as pairs.",
        example: "list(enumerate(['a','b']))\n# [(0,'a'),(1,'b')]",
      },
      {
        n: 17,
        name: "zip()",
        purpose: "Combine elements from iterables.",
        example: "list(zip([1,2],['a','b']))\n# [(1,'a'),(2,'b')]",
      },
    ],
  },
];

export function getCheatsheet(slug: string) {
  return CHEATSHEETS.find((sheet) => sheet.slug === slug);
}
