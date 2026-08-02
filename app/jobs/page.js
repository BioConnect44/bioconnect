"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppShell from "@/components/AppShell";

function detectCategory(job) {
  if (job.category && job.category !== "Other") return job.category;
  const text = `${job.title} ${job.description || ""} ${(job.skills || []).join(" ")}`.toLowerCase();
  if (/intern|internship|trainee/i.test(text)) return "Internship";
  if (/bioinformatics|computational|data.?scien|machine.?learn/i.test(text)) return "Bioinformatics";
  if (/clinical|trial|patient|pharmacovig/i.test(text)) return "Clinical";
  if (/research|scientist|r&d|molecular|genomic|biochem|microb/i.test(text)) return "Research";
  if (/manufactur|production|process|quality|gmp/i.test(text)) return "Manufacturing";
  if (/sales|marketing|commercial/i.test(text)) return "Sales";
  if (/regulat|compliance|affairs/i.test(text)) return "Regulatory";
  return "Other";
}

const INDUSTRIES = ["Research", "Clinical", "Manufacturing", "Bioinformatics", "Sales", "Regulatory", "Internship"];
const JOB_TYPES = ["Full-time", "Part-time", "Internship"];

export default function JobsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", location: "India", job_type: "Full-time", experience: "", salary: "", description: "", skills: "", apply_url: "", category: "Research" });

  async function loadAll() {
    const { data: { user } } = await supabase.auth.getUser();
    // eslint-disable-next-line no-restricted-globals
    if (!user) { window.location.href = "/login"; return; }
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(data);
    let scraped = [];
    try {
      const res = await fetch("/api/jobs?limit=500");
      const d = await res.json();
      scraped = (d.jobs || []).map(j => ({ ...j, category: detectCategory(j), company: j.company?.split("(")[0]?.trim() || j.company, _source: "scraped", _id: j.job_id }));
      setLastUpdated(d.last_updated);
    } catch (e) {}
    const { data: manual } = await supabase.from("manual_jobs").select("*, profiles(full_name)").eq("is_active", true).order("created_at", { ascending: false });
    const manualJobs = (manual || []).map(j => ({ title: j.title, company: j.company, location: j.location, job_type: j.job_type, experience: j.experience, salary: j.salary, description: j.description, skills: j.skills || [], url: j.apply_url, category: j.category || detectCategory(j), posted_by: j.posted_by, posted_by_name: j.profiles?.full_name, _source: "manual", _id: j.id, _supabaseId: j.id }));
    setAllJobs([...manualJobs, ...scraped]);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  async function handleAddJob(e) {
    e.preventDefault(); setSaving(true);
    const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
    const { error } = await supabase.from("manual_jobs").insert({ posted_by: profile.id, title: form.title, company: form.company, location: form.location, job_type: form.job_type, experience: form.experience, salary: form.salary, description: form.description, skills, apply_url: form.apply_url, category: form.category });
    if (error) alert("Error: " + error.message);
    else { setShowAdd(false); setForm({ title: "", company: "", location: "India", job_type: "Full-time", experience: "", salary: "", description: "", skills: "", apply_url: "", category: "Research" }); await loadAll(); }
    setSaving(false);
  }

  async function handleDelete(id) { if (!confirm("Delete?")) return; await supabase.from("manual_jobs").delete().eq("id", id); await loadAll(); }
  function toggleCat(c) { setSelectedCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]); }
  function toggleType(t) { setSelectedTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]); }
  function clearAll() { setSelectedCats([]); setSelectedTypes([]); setSearch(""); }

  const isEducator = profile?.role === "educator" || profile?.role === "researcher" || profile?.role === "industry";
  const filtered = allJobs.filter(j => {
    const q = search.toLowerCase();
    return (!q || j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q) || j.description?.toLowerCase().includes(q) || j.skills?.some(s => s.toLowerCase().includes(q)))
      && (selectedCats.length === 0 || selectedCats.includes(j.category))
      && (selectedTypes.length === 0 || selectedTypes.includes(j.job_type));
  });
  const catCounts = {};
  allJobs.forEach(j => { catCounts[j.category] = (catCounts[j.category] || 0) + 1; });
  const catColors = { Research: "#8B5CF6", Clinical: "#14B8A6", Manufacturing: "#F97316", Bioinformatics: "#3B82F6", Sales: "#EC4899", Regulatory: "#10B981", Internship: "#F59E0B", Other: "#6B8A9A" };

  return (
    <AppShell active="/jobs">
      <style>{`.job-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.06)}.radio-opt input{accent-color:#14B8A6}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>Career Hub</h1>
          <p style={{ fontSize: "14px", color: "#6B8A9A" }}>Discover biotech opportunities across India</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {isEducator && <button onClick={() => setShowAdd(!showAdd)} style={{ background: "#14B8A6", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{showAdd ? "Cancel" : "+ Post Job"}</button>}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #E2EEF0", borderRadius: "10px", padding: "8px 14px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }}></div>
            <span style={{ fontSize: "12px", color: "#6B8A9A", fontWeight: 500 }}>Auto-updated</span>
          </div>
        </div>
      </div>

      {showAdd && (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #E2EEF0", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1B2B3A", marginBottom: "4px" }}>Post a Job</h3>
          <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "16px" }}>Manual jobs have a direct Apply Now link</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={L}>Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={I} placeholder="Research Scientist"/></div>
            <div><label style={L}>Company *</label><input value={form.company} onChange={e => setForm({...form, company: e.target.value})} style={I} placeholder="Biocon"/></div>
            <div><label style={L}>Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} style={I}/></div>
            <div><label style={L}>Type</label><select value={form.job_type} onChange={e => setForm({...form, job_type: e.target.value})} style={I}><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option></select></div>
            <div><label style={L}>Experience</label><input value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} style={I} placeholder="2-4 years"/></div>
            <div><label style={L}>Salary</label><input value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} style={I} placeholder="₹6-10 LPA"/></div>
            <div><label style={L}>Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={I}>{INDUSTRIES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label style={L}>Skills</label><input value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} style={I} placeholder="CRISPR, PCR (comma separated)"/></div>
            <div style={{ gridColumn: "1/-1" }}><label style={L}>Apply URL *</label><input value={form.apply_url} onChange={e => setForm({...form, apply_url: e.target.value})} style={I} placeholder="https://..."/></div>
            <div style={{ gridColumn: "1/-1" }}><label style={L}>Description *</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} style={{...I, resize: "vertical"}} placeholder="Job description..."/></div>
            <div style={{ gridColumn: "1/-1" }}><button onClick={handleAddJob} disabled={saving||!form.title||!form.company||!form.apply_url} style={{ background: "#14B8A6", color: "#fff", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: saving||!form.title||!form.company||!form.apply_url ? 0.5 : 1 }}>{saving ? "Posting..." : "Post Job"}</button></div>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <input type="text" placeholder="Search roles, companies, or skills..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "13px 48px 13px 18px", border: "1.5px solid #E2EEF0", borderRadius: "12px", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fff", color: "#1B2B3A" }}/>
        <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#14B8A6", fontSize: "18px" }}>🔍</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "14px", color: "#6B8A9A" }}>Showing <strong style={{ color: "#1B2B3A" }}>{filtered.length}</strong> opportunities</span>
        {lastUpdated && <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Last scraped {new Date(lastUpdated).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "24px" }}>
        {/* Filters */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid #E2EEF0", position: "sticky", top: "20px", alignSelf: "flex-start" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#1B2B3A", textTransform: "uppercase", letterSpacing: "0.5px" }}>FILTERS</span>
            {(selectedCats.length > 0 || selectedTypes.length > 0) && <button onClick={clearAll} style={{ fontSize: "12px", color: "#14B8A6", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Clear</button>}
          </div>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "10px" }}>Industry</p>
          {INDUSTRIES.map(cat => (
            <label key={cat} className="radio-opt" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 0", cursor: "pointer", fontSize: "14px", color: "#374151" }}>
              <input type="radio" name="cat" checked={selectedCats.includes(cat)} onChange={() => setSelectedCats(selectedCats.includes(cat) ? [] : [cat])} style={{ width: 16, height: 16 }}/>
              <span style={{ flex: 1 }}>{cat}</span>
              {catCounts[cat] > 0 && <span style={{ fontSize: "12px", color: "#9CA3AF", background: "#F0F7F8", padding: "2px 8px", borderRadius: "100px" }}>{catCounts[cat]}</span>}
            </label>
          ))}
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", margin: "16px 0 10px" }}>Job Type</p>
          {JOB_TYPES.map(type => (
            <label key={type} className="radio-opt" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 0", cursor: "pointer", fontSize: "14px", color: "#374151" }}>
              <input type="radio" name="type" checked={selectedTypes.includes(type)} onChange={() => setSelectedTypes(selectedTypes.includes(type) ? [] : [type])} style={{ width: 16, height: 16 }}/>
              <span>{type}</span>
            </label>
          ))}
        </div>

        {/* Jobs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {loading ? <div style={{ textAlign: "center", padding: "80px", color: "#9CA3AF" }}>Loading...</div> : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#9CA3AF" }}><p>No jobs found</p></div>
          ) : filtered.map(job => {
            const isManual = job._source === "manual";
            const cc = catColors[job.category] || catColors.Other;
            return (
              <div key={job._id} className="job-card" style={{ background: "#fff", border: isManual ? `2px solid #14B8A6` : "1.5px solid #E2EEF0", borderRadius: "16px", padding: "22px 26px", transition: "all .2s", borderLeft: isManual ? "4px solid #14B8A6" : undefined }}>
                {isManual && <span style={{ fontSize: "11px", color: "#F97316", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>DIRECT APPLY</span>}
                {!isManual && job.source && <span style={{ fontSize: "11px", color: "#6B8A9A", background: "#F0F7F8", padding: "3px 8px", borderRadius: "4px", marginBottom: "8px", display: "inline-block" }}>in {job.source?.split("(")[0]?.trim()}</span>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1B2B3A", marginBottom: "4px" }}>{job.title}</h3>
                    <p style={{ fontSize: "13px", color: "#6B8A9A", marginBottom: "10px" }}>
                      <span style={{ fontWeight: 500, color: "#374151" }}>{job.company}</span>
                      {job.location && <span> • {job.location}</span>}
                      {job.experience && <span> • {job.experience}</span>}
                    </p>
                    {job.description && <p style={{ fontSize: "13px", color: "#6B8A9A", lineHeight: "1.6", marginBottom: "12px" }}>{job.description.length > 160 ? job.description.slice(0,160) + "..." : job.description}</p>}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                      {job.job_type && <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", background: "#1B2B3A", color: "#fff", textTransform: "uppercase" }}>{job.job_type}</span>}
                      {job.category && job.category !== "Other" && <span style={{ fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px", background: cc + "15", color: cc }}>{job.category}</span>}
                      {job.skills?.slice(0,3).map((s,i) => <span key={i} style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "6px", background: "#F0F7F8", color: "#6B8A9A" }}>{s}</span>)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {job.salary && <span style={{ fontSize: "15px", fontWeight: 700, color: "#14B8A6" }}>{job.salary}</span>}
                      {isManual && job.posted_by_name && <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Posted by {job.posted_by_name}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
                    {job.url && <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ background: isManual ? "#F97316" : "#1B2B3A", color: "#fff", padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, textDecoration: "none", textAlign: "center", whiteSpace: "nowrap" }}>{isManual ? "Apply Now →" : "Visit Career Page ↗"}</a>}
                    {isManual && profile?.id === job.posted_by && <button onClick={() => handleDelete(job._supabaseId)} style={{ fontSize: "12px", color: "#EF4444", background: "#FEF2F2", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
const L = { display: "block", fontSize: "13px", fontWeight: 500, color: "#6B8A9A", marginBottom: "6px" };
const I = { width: "100%", padding: "10px 14px", border: "1.5px solid #E2EEF0", borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fff", color: "#1B2B3A" };