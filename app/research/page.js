"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";
import ResearchSummaryWidget from "@/components/ResearchSummaryWidget";

export default function ResearchPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
    }
    load();
  }, []);

  return (
    <AppShell active="/research">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1B2B3A", margin: 0 }}>
            Explore PubMed Research & Literature
          </h1>
          <p style={{ fontSize: "14px", color: "#6B8A9A", margin: "4px 0 0" }}>
            Real-time peer-reviewed research analysis with standardized 7-part schemas & Supabase Cloud sync.
          </p>
        </div>
      </div>

      {/* PubMed AI Research Summary Widget */}
      <ResearchSummaryWidget userId={profile?.id} />
    </AppShell>
  );
}
