import type { Metadata } from "next";
import AdminApplicationsClient from "@/components/admin/AdminApplicationsClient";

export const metadata: Metadata = { title: "Writer Applications — Admin — Learno-Boy" };

export default function AdminApplicationsPage() {
  return <AdminApplicationsClient />;
}
