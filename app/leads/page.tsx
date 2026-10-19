import type { Metadata } from "next";
import { LeadsDashboard } from "@/components/LeadsDashboard";

export const metadata: Metadata = {
  title: "Leads (demo)",
  // Unlinked from the nav and kept out of search results.
  robots: { index: false, follow: false },
};

export default function LeadsPage() {
  return <LeadsDashboard />;
}
