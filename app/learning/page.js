"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";
import LiveStudentWidgets from "@/components/LiveStudentWidgets";

const SUBJECTS = [
  { id: "molecular-biology", name: "Molecular Biology", icon: "🧬", color: "#14B8A6" },
  { id: "biochemistry", name: "Biochemistry", icon: "⚗️", color: "#F97316" },
  { id: "microbiology", name: "Microbiology", icon: "🦠", color: "#EF4444" },
  { id: "genetics", name: "Genetics", icon: "🔬", color: "#8B5CF6" },
  { id: "bioinformatics", name: "Bioinformatics", icon: "💻", color: "#3B82F6" },
  { id: "bioprocess-engineering", name: "Bioprocess Engineering", icon: "🏭", color: "#EC4899" },
];

/* ── Student / Researcher View ── */
function StudentView({ supabase, profile }) {
  const [notes, setNotes] = useState({});
  const [openSubject, setOpenSubject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const isResearcher = profile?.role === "researcher";

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    const r = {};
    for (const sub of SUBJECTS) {
      const { data } = await supabase.storage.from("course-materials").list(sub.id);
      r[sub.id] = data || [];
    }
    setNotes(r);
  }

  async function handleUpload(sid, file) {
    if (!file?.name.endsWith(".pdf")) { alert("Please upload a PDF"); return; }
    setUploading(true);
    const fn = `${profile.id.slice(0,8)}_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("course-materials").upload(`${sid}/${fn}`, file);
    if (error) alert("Upload failed: " + error.message);
    else await loadNotes();
    setUploading(false);
  }

  function getUrl(sid, fn) {
    return supabase.storage.from("course-materials").getPublicUrl(`${sid}/${fn}`).data.publicUrl;
  }

  async function handleDelete(sid, fn) {
    if (!confirm("Delete?")) return;
    await supabase.storage.from("course-materials").remove([`${sid}/${fn}`]);
    await loadNotes();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px" }}>
      {/* LEFT — main content */}
      <div>
        {/* Continue banner */}
        <div style={{ background: "linear-gradient(135deg, #132D35 0%, #1B4A5A 100%)", borderRadius: "20px", padding: "28px 32px", marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "11px", color: "#14B8A6", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", background: "rgba(20,184,166,0.15)", padding: "4px 10px", borderRadius: "6px" }}>UP NEXT</span>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: "10px 0 6px" }}>Chapter 4: CRISPR & Gene Editing</h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", marginBottom: "20px" }}>Genetics • 4 pages remaining</p>
            <button style={{ background: "#fff", color: "#132D35", border: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Continue Learning →</button>
          </div>
          <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#14B8A6" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*40*0.75} ${2*Math.PI*40*0.25}`}
                strokeDashoffset={2*Math.PI*40*0.25}
                transform="rotate(-90 50 50)"/>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, color: "#fff" }}>75%</div>
          </div>
        </div>

        {/* PYQ section */}
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A", marginBottom: "14px" }}>Exam Prep & PYQs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "28px" }}>
          <div style={{ background: "#FFF3E8", borderRadius: "14px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #FFD4A3" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>Genetics PYQs</p>
              <p style={{ fontSize: "12px", color: "#6B8A9A" }}>10 MCQs • <span style={{ color: "#F97316", fontWeight: 600 }}>+100 XP</span></p>
            </div>
            <button style={{ background: "#F97316", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Start Challenge</button>
          </div>
          <div style={{ background: "#F3F0FF", borderRadius: "14px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #DDD6FE" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>Timed Mock Exam</p>
              <p style={{ fontSize: "12px", color: "#6B8A9A" }}>20 MCQs • <span style={{ color: "#8B5CF6", fontWeight: 600 }}>+100 XP</span></p>
            </div>
            <button style={{ background: "#8B5CF6", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Start Challenge</button>
          </div>
        </div>

        {/* Researcher add course option */}
        {isResearcher && (
          <div style={{ background: "#F0FCFB", border: "1.5px dashed #14B8A6", borderRadius: "14px", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#1B2B3A" }}>Share your expertise</p>
              <p style={{ fontSize: "13px", color: "#6B8A9A" }}>Upload your research notes or course materials</p>
            </div>
            <a href="/learning" style={{ background: "#14B8A6", color: "#fff", padding: "9px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>+ Add Course</a>
          </div>
        )}

        {/* Active Courses */}
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A", marginBottom: "14px" }}>Active Courses</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {SUBJECTS.map(sub => {
            const isOpen = openSubject === sub.id;
            const pdfs = (notes[sub.id] || []).filter(f => f.name?.endsWith(".pdf"));
            return (
              <div key={sub.id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2EEF0", overflow: "hidden" }}>
                <button onClick={() => setOpenSubject(isOpen ? null : sub.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "10px", background: sub.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{sub.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#1B2B3A" }}>{sub.name}</p>
                    <p style={{ fontSize: "12px", color: "#6B8A9A" }}>{pdfs.length} notes • Module 1 of 3</p>
                  </div>
                  <div style={{ width: "120px", margin: "0 12px" }}>
                    <div style={{ height: 4, background: "#E2EEF0", borderRadius: "4px" }}>
                      <div style={{ height: 4, width: "30%", background: sub.color, borderRadius: "4px" }}></div>
                    </div>
                  </div>
                  <a href="#" style={{ fontSize: "13px", color: "#14B8A6", fontWeight: 500 }}>View Course →</a>
                  <span style={{ fontSize: "16px", color: "#C0CDD5", marginLeft: "8px", transform: isOpen ? "rotate(180deg)" : "none", display: "block" }}>▾</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 20px 20px", borderTop: "1px solid #F0F7F8" }}>
                    {pdfs.length === 0 ? (
                      <p style={{ fontSize: "13px", color: "#9CA3AF", padding: "14px 0 8px" }}>No notes uploaded yet.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px 0 8px" }}>
                        {pdfs.map(f => (
                          <div key={f.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "#F8FCFC", borderRadius: "10px" }}>
                            <span>📄</span>
                            <span style={{ flex: 1, fontSize: "13px", color: "#1B2B3A", fontWeight: 500 }}>{f.name.replace(/^[^_]+_\d+_/, "")}</span>
                            <a href={getUrl(sub.id, f.name)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#14B8A6", fontWeight: 600, padding: "5px 12px", background: "rgba(20,184,166,0.08)", borderRadius: "6px" }}>View</a>
                          </div>
                        ))}
                      </div>
                    )}
                    {isResearcher && (
                      <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#14B8A6", color: "#fff", padding: "9px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.7 : 1, marginTop: "8px" }}>
                        {uploading ? "Uploading..." : "📤 Upload PDF"}
                        <input type="file" accept=".pdf" hidden disabled={uploading} onChange={e => handleUpload(sub.id, e.target.files?.[0])}/>
                      </label>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDEBAR — LiveStudentWidgets handles streak, bio-minute & quests */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <LiveStudentWidgets />
      </div>
    </div>
  );
}

/* ── Educator View ── */
function EducatorView({ supabase, profile }) {
  const [notes, setNotes] = useState({});
  const [openSubject, setOpenSubject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showAddMCQ, setShowAddMCQ] = useState(false);
  const [mcqForm, setMcqForm] = useState({ subject: "genetics", question: "", options: ["","","",""], answer: 0, xp: "20" });

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    const r = {};
    for (const sub of SUBJECTS) {
      const { data } = await supabase.storage.from("course-materials").list(sub.id);
      r[sub.id] = data || [];
    }
    setNotes(r);
  }

  async function handleUpload(sid, file) {
    if (!file?.name.endsWith(".pdf")) { alert("Please upload a PDF"); return; }
    setUploading(true);
    const fn = `${profile.id.slice(0,8)}_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("course-materials").upload(`${sid}/${fn}`, file);
    if (error) alert("Upload failed: " + error.message);
    else await loadNotes();
    setUploading(false);
  }

  function getUrl(sid, fn) {
    return supabase.storage.from("course-materials").getPublicUrl(`${sid}/${fn}`).data.publicUrl;
  }

  async function handleDelete(sid, fn) {
    if (!confirm("Delete?")) return;
    await supabase.storage.from("course-materials").remove([`${sid}/${fn}`]);
    await loadNotes();
  }

  const totalNotes = Object.values(notes).reduce((acc, arr) => acc + arr.filter(f => f.name?.endsWith(".pdf")).length, 0);

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" }}>
        {[
          { label: "Total Materials", value: totalNotes, icon: "📚", color: "#14B8A6" },
          { label: "Subjects", value: SUBJECTS.length, icon: "🧬", color: "#8B5CF6" },
          { label: "Students (approx)", value: "—", icon: "👥", color: "#F97316" },
          { label: "MCQ Sets", value: "2", icon: "📝", color: "#3B82F6" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: "14px", padding: "18px 20px", border: "1px solid #E2EEF0", display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "10px", background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{s.icon}</div>
            <div>
              <p style={{ fontSize: "20px", fontWeight: 700, color: "#1B2B3A" }}>{s.value}</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* My Courses */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A" }}>My Courses</h2>
            <span style={{ fontSize: "13px", color: "#14B8A6", fontWeight: 500 }}>Manage Materials</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {SUBJECTS.map(sub => {
              const isOpen = openSubject === sub.id;
              const pdfs = (notes[sub.id] || []).filter(f => f.name?.endsWith(".pdf"));
              return (
                <div key={sub.id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2EEF0", overflow: "hidden" }}>
                  <button onClick={() => setOpenSubject(isOpen ? null : sub.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "10px", background: sub.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{sub.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#1B2B3A" }}>{sub.name}</p>
                      <p style={{ fontSize: "12px", color: "#6B8A9A" }}>{pdfs.length} PDFs uploaded</p>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#14B8A6", background: "rgba(20,184,166,0.08)", padding: "4px 10px", borderRadius: "6px" }}>{pdfs.length > 0 ? `${pdfs.length} files` : "Empty"}</span>
                    <span style={{ fontSize: "16px", color: "#C0CDD5", marginLeft: "8px", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 18px 18px", borderTop: "1px solid #F0F7F8" }}>
                      {pdfs.length === 0 ? (
                        <p style={{ fontSize: "13px", color: "#9CA3AF", padding: "12px 0 8px" }}>No files yet</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "10px 0 8px" }}>
                          {pdfs.map(f => (
                            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", background: "#F8FCFC", borderRadius: "8px" }}>
                              <span>📄</span>
                              <span style={{ flex: 1, fontSize: "13px", color: "#1B2B3A", fontWeight: 500 }}>{f.name.replace(/^[^_]+_\d+_/, "")}</span>
                              <a href={getUrl(sub.id, f.name)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#14B8A6", fontWeight: 600, padding: "4px 10px", background: "rgba(20,184,166,0.08)", borderRadius: "6px" }}>View</a>
                              <button onClick={() => handleDelete(sub.id, f.name)} style={{ fontSize: "12px", color: "#EF4444", background: "#FEF2F2", border: "none", padding: "4px 8px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                            </div>
                          ))}
                        </div>
                      )}
                      <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#14B8A6", color: "#fff", padding: "8px 16px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.7 : 1, marginTop: "8px" }}>
                        {uploading ? "Uploading..." : "📤 Upload PDF"}
                        <input type="file" accept=".pdf" hidden disabled={uploading} onChange={e => handleUpload(sub.id, e.target.files?.[0])}/>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* PYQ MCQs */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1B2B3A" }}>PYQ MCQs</h2>
            <button onClick={() => setShowAddMCQ(!showAddMCQ)} style={{ background: "#F97316", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {showAddMCQ ? "Cancel" : "+ Add MCQ"}
            </button>
          </div>
          {showAddMCQ && (
            <div style={{ background: "#fff", borderRadius: "14px", padding: "20px", border: "1px solid #E2EEF0", marginBottom: "14px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#1B2B3A", marginBottom: "16px" }}>Add MCQ Question</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={L}>Subject</label>
                  <select value={mcqForm.subject} onChange={e => setMcqForm({...mcqForm, subject: e.target.value})} style={I}>
                    {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={L}>Question *</label>
                  <textarea value={mcqForm.question} onChange={e => setMcqForm({...mcqForm, question: e.target.value})} rows={2} style={{...I, resize: "vertical"}} placeholder="Enter your MCQ question..."/>
                </div>
                {mcqForm.options.map((opt, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input type="radio" name="answer" checked={mcqForm.answer === i} onChange={() => setMcqForm({...mcqForm, answer: i})} style={{ accentColor: "#14B8A6", width: 16, height: 16, flexShrink: 0 }}/>
                    <input value={opt} onChange={e => { const opts = [...mcqForm.options]; opts[i] = e.target.value; setMcqForm({...mcqForm, options: opts}); }} style={{ ...I, flex: 1 }} placeholder={`Option ${i + 1}${i === mcqForm.answer ? " (correct)" : ""}`}/>
                  </div>
                ))}
                <p style={{ fontSize: "12px", color: "#9CA3AF" }}>Select the radio button next to the correct answer</p>
                <div>
                  <label style={L}>XP Reward</label>
                  <input value={mcqForm.xp} onChange={e => setMcqForm({...mcqForm, xp: e.target.value})} style={I} placeholder="20"/>
                </div>
                <button onClick={() => {
                  if (!mcqForm.question || mcqForm.options.some(o => !o)) { alert("Fill all fields"); return; }
                  alert("MCQ saved!");
                  setShowAddMCQ(false);
                  setMcqForm({ subject: "genetics", question: "", options: ["","","",""], answer: 0, xp: "20" });
                }} style={{ background: "#F97316", color: "#fff", border: "none", padding: "11px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Save MCQ
                </button>
              </div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { title: "Genetics PYQs", count: 10, xp: 100, subject: "Genetics", color: "#F97316", bg: "#FFF3E8" },
              { title: "Biochemistry MCQs", count: 15, xp: 150, subject: "Biochemistry", color: "#8B5CF6", bg: "#F3F0FF" },
              { title: "Timed Mock Exam", count: 20, xp: 200, subject: "All Subjects", color: "#14B8A6", bg: "#F0FCFB" },
            ].map(q => (
              <div key={q.title} style={{ background: q.bg, borderRadius: "14px", padding: "18px 20px", border: `1px solid ${q.color}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>{q.title}</p>
                    <p style={{ fontSize: "12px", color: "#6B8A9A" }}>{q.count} MCQs • {q.subject} • <span style={{ color: q.color, fontWeight: 600 }}>+{q.xp} XP</span></p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{ background: "#fff", color: q.color, border: `1.5px solid ${q.color}`, padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                    <button style={{ background: q.color, color: "#fff", border: "none", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Preview</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LearningPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <AppShell active="/learning">
      {loading
        ? <div style={{ textAlign: "center", padding: "100px", color: "#9CA3AF" }}>Loading...</div>
        : profile?.role === "educator"
          ? <EducatorView supabase={supabase} profile={profile} />
          : <StudentView supabase={supabase} profile={profile} />
      }
    </AppShell>
  );
}

const L = { display: "block", fontSize: "12px", fontWeight: 600, color: "#6B8A9A", marginBottom: "6px" };
const I = { width: "100%", padding: "10px 14px", border: "1.5px solid #E2EEF0", borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fff", color: "#1B2B3A" };