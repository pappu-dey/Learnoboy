import type { Metadata } from "next";
import { BASE_URL } from "@/lib/utils/seo";
import HtmlCompilerClient from "./HtmlCompilerClient";

export const metadata: Metadata = {
  title: "Online HTML, CSS & JavaScript Sandbox Compiler | LearnoBoy",
  description: "Write, compile, test, and run your HTML, CSS, and JS code in real-time. Features side-by-side editing, live output preview, and developer console log stream.",
  alternates: {
    canonical: `${BASE_URL}/compiler/html`,
  },
  openGraph: {
    type: "website",
    title: "Online HTML, CSS & JavaScript Sandbox Compiler | LearnoBoy",
    description: "Write, compile, test, and run your HTML, CSS, and JS code in real-time. Features side-by-side editing, live output preview, and developer console log stream.",
    url: `${BASE_URL}/compiler/html`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Online HTML, CSS & JavaScript Sandbox Compiler | LearnoBoy",
    description: "Write, compile, test, and run your HTML, CSS, and JS code in real-time. Features side-by-side editing, live output preview, and developer console log stream.",
  },
};

export default function HtmlCompilerPage() {
  return <HtmlCompilerClient />;
}
