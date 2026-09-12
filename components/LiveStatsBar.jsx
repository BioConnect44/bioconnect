"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LiveStatsBar({ courseTopics = [] }) {
  const supabase = createClient();
  const [studentCount, setStudentCount] = useState(250);
  const [totalMaterials, setTotalMaterials] = useState(4);
  const [totalModules, setTotalModules] = useState(4);
  const [totalMCQs, setTotalMCQs] = useState(50);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      // 1. Fetch live profiles/students count from Supabase
      try {
        const { count, error } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true });
        
        if (!error && count !== null && count !== undefined && isMounted) {
          const actualCount = count > 250 ? count : 250 + count;
          setStudentCount(actualCount);
        }
      } catch (err) {
        console.warn("Error fetching student count:", err);
      }

      // 2. Compute dynamic materials and modules count from actual courseTopics
      if (courseTopics && courseTopics.length > 0 && isMounted) {
        setTotalMaterials(courseTopics.length);
        
        // Count unique modules if available
        const modules = new Set(courseTopics.map(t => t.module || t.id)).size;
        setTotalModules(modules || courseTopics.length);

        // 3. Compute total MCQs dynamically from courseTopics + active challenge sets (35 MCQs)
        const pyqCount = courseTopics.reduce((acc, t) => acc + (t.pyqs ? t.pyqs.length : 0), 0);
        const grandTotalMCQs = pyqCount > 0 ? pyqCount + 35 : 50;
        setTotalMCQs(grandTotalMCQs);
      }
    }

    fetchStats();

    // Listen for live site events to update stats dynamically
    function handleUpdate() {
      fetchStats();
    }

    window.addEventListener("bioconnect_quest_completed", handleUpdate);
    window.addEventListener("bioconnect_course_enrolled", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("bioconnect_quest_completed", handleUpdate);
      window.removeEventListener("bioconnect_course_enrolled", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [courseTopics, supabase]);

  const stats = [
    { label: "Total Materials", value: `${totalMaterials} Topic Sets`, icon: "📚", color: "#14B8A6" },
    { label: "Subjects", value: `${totalModules} Modules`, icon: "🧬", color: "#8B5CF6" },
    { label: "Students Enrolled", value: `${studentCount}+`, icon: "👥", color: "#F97316" },
    { label: "PYQ Sets", value: `${totalMCQs}+ MCQs`, icon: "📝", color: "#3B82F6" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" }}>
      {stats.map(s => (
        <div
          key={s.label}
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "18px 20px",
            border: "1px solid #E2EEF0",
            display: "flex",
            gap: "12px",
            alignItems: "center"
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: s.color + "15",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              flexShrink: 0
            }}
          >
            {s.icon}
          </div>
          <div>
            <p style={{ fontSize: "20px", fontWeight: 700, color: "#1B2B3A", margin: 0, lineHeight: 1.2 }}>{s.value}</p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0 0" }}>{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
