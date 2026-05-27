import type { Metadata } from "next";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export const metadata: Metadata = { title: "Users — Admin — Learno-Boy" };

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}
