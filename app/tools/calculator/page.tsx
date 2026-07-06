import type { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Free Online Calculator – Basic & Scientific | LearnoBoy",
  description:
    "Free online calculator with Basic and Scientific modes. Supports trig, log, powers, factorial, memory functions and full keyboard input.",
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
