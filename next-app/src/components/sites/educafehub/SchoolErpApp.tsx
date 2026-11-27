"use client";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

// EduCafe School ERP, inside the website (Sir's order 26 Nov 2026).
// The website is a static site, so ERP data is saved in this browser
// (localStorage) on this device. No server, no upload.

type Rec = Record<string, string>;
type Db = {
  settings: Rec;
  students: Rec[];
  enquiries: Rec[];
  staff: Rec[];
  attendance: Record<string, Record<string, string>>;
  feeHeads: Rec[];
  payments: Rec[];
  exams: Rec[];
  certificates: Rec[];
  periods: Rec[];
  books: Rec[];
  issues: Rec[];
  routes: Rec[];
  ledger: Rec[];
  gate: Rec[];
  stock: Rec[];
  notices: Rec[];
};

const EMPTY: Db = {
  settings: { name: "", udise: "", board: "", session: "2026-27" },
  students: [], enquiries: [], staff: [], attendance: {}, feeHeads: [],
  payments: [], exams: [], certificates: [], periods: [], books: [],
  issues: [], routes: [], ledger: [], gate: [], stock: [], notices: [],
};

const KEY = "educafe-school-erp-v1";
const CLASSES = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

const MODULES = [
  { id: "dashboard", en: "Dashboard", hi: "डैशबोर्ड" },
  { id: "students", en: "Students", hi: "छात्र" },
  { id: "admissions", en: "Admissions", hi: "प्रवेश" },
  { id: "attendance", en: "Attendance", hi: "उपस्थिति" },
  { id: "fees", en: "Fees", hi: "शुल्क" },
  { id: "staff", en: "Staff and Payroll", hi: "कर्मचारी और वेतन" },
  { id: "exams", en: "Exams and Reports", hi: "परीक्षा और रिपोर्ट" },
  { id: "certificates", en: "Certificates", hi: "प्रमाणपत्र" },
  { id: "timetable", en: "Timetable", hi: "समय सारणी" },
  { id: "library", en: "Library", hi: "पुस्तकालय" },
  { id: "transport", en: "Transport", hi: "परिवहन" },
  { id: "accounts", en: "Accounts", hi: "लेखा" },
  { id: "gate", en: "Gate and Visitors", hi: "गेट और आगंतुक" },
  { id: "inventory", en: "Inventory", hi: "भंडार" },
  { id: "govt", en: "Government Reports", hi: "सरकारी रिपोर्ट" },
  { id: "notices", en: "Notices", hi: "सूचनाएँ" },
  { id: "settings", en: "School Setup", hi: "स्कूल सेटअप" },
] as const;

type ModId = (typeof MODULES)[number]["id"];

const S: Record<string, React.CSSProperties> = {
  shell: { display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" },
  side: { flex: "0 0 210px", display: "flex", flexDirection: "column", gap: 6 },
  navBtn: { textAlign: "left", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--line, #d8e2d8)", background: "var(--card, #fff)", cursor: "pointer", fontWeight: 600, fontSize: 14.5 },
  navOn: { background: "#0c5a45", color: "#fff", border: "1px solid #0c5a45" },
  main: { flex: "1 1 320px", minWidth: 300 },
  hero: { background: "#0a4a3a", color: "#fff", borderRadius: 16, padding: "20px 22px", marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 },
  stat: { background: "var(--card, #fff)", border: "1px solid var(--line, #d8e2d8)", borderRadius: 16, padding: "16px 18px" },
  statN: { fontSize: 26, fontWeight: 800 },
  card: { background: "var(--card, #fff)", border: "1px solid var(--line, #d8e2d8)", borderRadius: 16, padding: "18px 20px", marginBottom: 14 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #c3d2c3", fontSize: 15, marginBottom: 10, background: "#fff", color: "#12261e" },
  row: { display: "flex", gap: 10, flexWrap: "wrap" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { textAlign: "left", padding: "8px 10px", borderBottom: "2px solid #d8e2d8" },
  td: { padding: "8px 10px", borderBottom: "1px solid #e4ece4" },
  del: { border: "none", background: "none", color: "#b3261e", cursor: "pointer", fontWeight: 700 },
  small: { fontSize: 13, opacity: 0.8 },
};

function uid() { return Math.random().toString(36).slice(2, 9); }

export function SchoolErpApp() {
  const [db, setDb] = useState<Db>(EMPTY);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<ModId>("dashboard");
  const [form, setForm] = useState<Rec>({});
  const [attDate, setAttDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [attClass, setAttClass] = useState("I");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("All");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDb({ ...EMPTY, ...(JSON.parse(raw) as Db) });
    } catch { /* start empty */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(db));
  }, [db, ready]);

  const set = (patch: Partial<Db>) => setDb((d) => ({ ...d, ...patch }));
  const addTo = (key: keyof Db, rec: Rec) => {
    const list = db[key] as Rec[];
    set({ [key]: [{ id: uid(), ...rec }, ...list] } as Partial<Db>);
    setForm({});
  };
  const delFrom = (key: keyof Db, id: string) => {
    const list = db[key] as Rec[];
    set({ [key]: list.filter((r) => r.id !== id) } as Partial<Db>);
  };
  const F = (name: string, ph: string, type = "text") => (
    <input style={S.input} type={type} placeholder={ph} value={form[name] || ""}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
  );
  const AddBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button className="btn" type="button" onClick={onClick}>{label}</button>
  );
  const Table = ({ cols, rows, onDel }: { cols: [string, string][]; rows: Rec[]; onDel: (id: string) => void }) => (
    rows.length === 0 ? <p style={S.small}>No records yet.</p> : (
      <div style={{ overflowX: "auto" }}>
        <table style={S.table}>
          <thead><tr>{cols.map(([k, label]) => <th key={k} style={S.th}>{label}</th>)}<th style={S.th}></th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id}>{cols.map(([k]) => <td key={k} style={S.td}>{r[k] || ""}</td>)}
              <td style={S.td}><button style={S.del} onClick={() => onDel(r.id)} aria-label="Delete">✕</button></td></tr>
          ))}</tbody>
        </table>
      </div>
    )
  );

  const todayAtt = db.attendance[attDate] || {};
  const attTodayCount = Object.values(db.attendance[new Date().toISOString().slice(0, 10)] || {}).filter((v) => v === "P").length;
  const feesCollected = db.payments.reduce((a, p) => a + (Number(p.amount) || 0), 0);
  const ledgerBal = db.ledger.reduce((a, l) => a + (l.kind === "Income" ? Number(l.amount) || 0 : -(Number(l.amount) || 0)), 0);

  const stats = useMemo(() => [
    { en: "Total students", hi: "कुल छात्र", n: String(db.students.length) },
    { en: "Staff", hi: "कर्मचारी", n: String(db.staff.length) },
    { en: "Present today", hi: "आज उपस्थित", n: String(attTodayCount) },
    { en: "Fees collected", hi: "शुल्क वसूली", n: "₹" + feesCollected.toLocaleString("en-IN") },
    { en: "Ledger balance", hi: "खाता शेष", n: "₹" + ledgerBal.toLocaleString("en-IN") },
    { en: "Books issued", hi: "जारी पुस्तकें", n: String(db.issues.length) },
  ], [db, attTodayCount, feesCollected, ledgerBal]);

const filteredStudents = useMemo(() =>
  db.students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (!q ||
        (s.name && s.name.toLowerCase().includes(q))) ||
      (!q ||
        (s.adm && s.adm.toLowerCase().includes(q))) ||
      (!q ||
        (s.pen && s.pen.toLowerCase().includes(q))) ||
      (!q ||
        (s.phone && s.phone.toLowerCase().includes(q)));
    const matchesClass = filterClass === "All" || s.cls === filterClass;
    return matchesSearch && matchesClass;
  }),
  [db, searchQuery, filterClass],
);

  const mod = MODULES.find((m) => m.id === view)!;

  const handleBackup = () => {
    const blob = new Blob([JSON.stringify(db)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "educafe-erp-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleRestore = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (r) => {
        try {
          const result = r.target!.result ? JSON.parse(r.target!.result as string) : {};
          if (confirm("Replace all ERP data with this backup?")) {
            setDb(result as Db);
          }
        } catch {
          alert("Invalid backup file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div>
      <div style={S.hero}>
        <h2 style={{ margin: "0 0 6px", fontSize: "clamp(22px,3.4vw,30px)" }}>
          {db.settings.name || "EduCafe School ERP"}
        </h2>
        <p style={{ margin: 0, opacity: 0.9 }}>
          <span className="en-only">Session {db.settings.session}{db.settings.board ? " · " + db.settings.board : ""}{db.settings.udise ? " · UDISE " + db.settings.udise : ""}. Data is saved in this browser on this device.</span>
          <span className="hi-only">सत्र {db.settings.session}{db.settings.board ? " · " + db.settings.board : ""}{db.settings.udise ? " · UDISE " + db.settings.udise : ""}। डेटा इस डिवाइस के ब्राउज़र में सहेजा जाता है।</span>
        </p>
      </div>
      <div style={S.shell}>
        <nav style={S.side} aria-label="ERP modules">
          {MODULES.map((m) => (
            <button key={m.id} style={{ ...S.navBtn, ...(view === m.id ? S.navOn : {}) }}
              onClick={() => { setView(m.id); setForm({}); }}>
              <span className="en-only">{m.en}</span><span className="hi-only">{m.hi}</span>
            </button>
          ))}
        </nav>
        <div style={S.main}>
          <h3 style={{ marginTop: 0 }}>
            <span className="en-only">{mod.en}</span><span className="hi-only">{mod.hi}</span>
          </h3>

          {view === "dashboard" && (
            <div>
              {!db.settings.name && (
                <div style={S.card}><strong>Set up your school first.</strong>
                  <p style={S.small}>Open School Setup, add your school name, UDISE code, board and session, then add students.</p></div>
              )}
              <div style={S.grid}>
                {stats.map((s) => (
                  <div key={s.en} style={S.stat}>
                    <div style={S.statN}>{s.n}</div>
                    <div style={S.small}><span className="en-only">{s.en}</span><span className="hi-only">{s.hi}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "settings" && (
            <div style={S.card}>
              {F("name", "School name")}{F("udise", "UDISE code")}{F("board", "Board (CBSE / BSEB / other)")}
              {F("session", "Session, e.g. 2026-27")}
              <AddBtn label="Save school setup" onClick={() => set({ settings: { ...db.settings, ...form } })} />
              <p style={S.small}>Current: {db.settings.name || "not set"} · {db.settings.udise || ""} · {db.settings.board || ""} · {db.settings.session}</p>
              <button className="btn" onClick={handleBackup}>Backup</button>
              <button className="btn ghost" onClick={handleRestore} style={{ marginLeft: 8 }}>Restore</button>
            </div>
          )}

          {view === "students" && (
            <div>
              <div style={S.card}>
                {F("name", "Student name")}{F("adm", "Admission number")}{F("cls", "Class (I to XII)")}{F("sec", "Section")}
                {F("pen", "PEN number")}{F("apaar", "APAAR ID")}{F("rte", "RTE: Yes / No")}{F("phone", "Guardian phone")}
<div style={{display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10}}>
  <span className="en-only" style={{fontSize: 12, color: "#12261e"}}>Gender</span><span className="hi-only" style={{fontSize: 12, color: "#12261e"}}>लिंग</span>
  <input style={S.input} type="text" placeholder="Gender" value={form.gender || ""} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
  <span className="en-only" style={{fontSize: 12, color: "#12261e"}}>DOB</span><span className="hi-only" style={{fontSize: 12, color: "#12261e"}}>जन्म तिथि</span>
  <input style={S.input} type="date" value={form.dob || ""} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
  <span className="en-only" style={{fontSize: 12, color: "#12261e"}}>Category</span><span className="hi-only" style={{fontSize: 12, color: "#12261e"}}>जाति / वर्ग</span>
  <select style={S.input} value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })}>
    <option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option><option value="EWS">EWS</option>
  </select>
  <span className="en-only" style={{fontSize: 12, color: "#12261e"}}>Medium</span><span className="hi-only" style={{fontSize: 12, color: "#12261e"}}>अध्ययन माध्यम</span>
  <select style={S.input} value={form.medium || ""} onChange={(e) => setForm({ ...form, medium: e.target.value })}>
    <option value="Hindi">Hindi</option><option value="English">English</option>
  </select>
  <span className="en-only" style={{fontSize: 12, color: "#12261e"}}>Father</span><span className="hi-only" style={{fontSize: 12, color: "#12261e"}}>पिता का नाम</span>
  <input style={S.input} type="text" placeholder="Father" value={form.father || ""} onChange={(e) => setForm({ ...form, father: e.target.value })} />
  <span className="en-only" style={{fontSize: 12, color: "#12261e"}}>Mother</span><span className="hi-only" style={{fontSize: 12, color: "#12261e"}}>माँ का नाम</span>
  <input style={S.input} type="text" placeholder="Mother" value={form.mother || ""} onChange={(e) => setForm({ ...form, mother: e.target.value })} />
  <span className="en-only" style={{fontSize: 12, color: "#12261e"}}>Address</span><span className="hi-only" style={{fontSize: 12, color: "#12261e"}}>पता</span>
  <input style={S.input} type="text" placeholder="Address" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
</div>
                <AddBtn label="Add student" onClick={() => form.name && addTo("students", form)} />
              </div>
              <div style={{ display: "flex", alignItems: "center", marginTop: 12, gap: 12 }}>
                <input style={{ ...S.input, width: "calc(100% - 160px)" }} type="text" placeholder="Search by name, admission, PEN or phone" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <select style={{ ...S.input, width: 140, marginLeft: 12 }} value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
                  <option value="All">All</option>
                  {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={S.card}>
                <Table cols={[["name", "Name"], ["adm", "Adm No"], ["cls", "Class"], ["sec", "Sec"], ["pen", "PEN"], ["apaar", "APAAR"], ["rte", "RTE"], ["phone", "Phone"], ["gender", "Gender"], ["category", "Category"]]}
                  rows={filteredStudents} onDel={(id) => delFrom("students", id)} />
              </div>
              <div style={S.card}>
                <AddBtn label="Export CSV" onClick={() => {
                  const csvRows = db.students.map((s) => [s.name, s.adm, s.cls, s.sec, s.pen, s.apaar, s.rte, s.phone, s.gender, s.dob, s.category, s.medium, s.father, s.mother, s.address].map((c) => `"${c}"`).join(",")).join("\n");
                  const blob = new Blob(["name,adm,cls,sec,pen,apaar,rte,phone,gender,dob,category,medium,father,mother,address\n" + csvRows], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "students.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }} />
                <AddBtn label="Import Excel or CSV" onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".xlsx, .csv";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (r) => {
                      const extension = file.name ? file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase() : "";
                      if (extension === "xlsx") {
                        const data = r.target!.result instanceof ArrayBuffer ? r.target!.result : new ArrayBuffer(0);
                        const workbook = XLSX.read(data, { type: "array" });
                        const firstSheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheetName];
                        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        for (let i = 1; i < rows.length; i++) {
                          const row = rows[i] as [string, ...string[]];
                          if (row[0] && String(row[0]).trim() === "Example Student Name") continue;
                          const cols: Record<string, number> = { name: 0, adm: 1, cls: 2, sec: 3, pen: 4, apaar: 5, rte: 6, phone: 7, gender: 8, dob: 9, category: 10, medium: 11, father: 12, mother: 13, address: 14 };
                          addTo("students", {
                            name: (row[cols["name"]] || "").toString().trim(),
                            adm: (row[cols["adm"]] || "").toString().trim(),
                            cls: (row[cols["cls"]] || "").toString().trim(),
                            sec: (row[cols["sec"]] || "").toString().trim(),
                            pen: (row[cols["pen"]] || "").toString().trim(),
                            apaar: (row[cols["apaar"]] || "").toString().trim(),
                            rte: (row[cols["rte"]] || "").toString().trim(),
                            phone: (row[cols["phone"]] || "").toString().trim(),
                            gender: (row[cols["gender"]] || "").toString().trim(),
                            dob: (row[cols["dob"]] || "").toString().trim(),
                            category: (row[cols["category"]] || "").toString().trim(),
                            medium: (row[cols["medium"]] || "").toString().trim(),
                            father: (row[cols["father"]] || "").toString().trim(),
                            mother: (row[cols["mother"]] || "").toString().trim(),
                            address: (row[cols["address"]] || "").toString().trim(),
                          });
                        }
                      } else {
                        const text = r.target!.result as string;
                        const lines = text.split("\n").slice(1);
                        lines.forEach((line) => {
                          const values = line.replace(/^"|"$/g, "").split(",").map((v) => v.replace(/^"|"$/g, ""));
                          if (values[0] && String(values[0]).trim() !== "Example Student Name") {
                            addTo("students", { name: values[0], adm: values[1] || "", cls: values[2] || "", sec: values[3] || "", pen: values[4] || "", apaar: values[5] || "", rte: values[6] || "", phone: values[7] || "", gender: values[8] || "", dob: values[9] || "", category: values[10] || "", medium: values[11] || "", father: values[12] || "", mother: values[13] || "", address: values[14] || "" });
                          }
                        });
                      }
                    };
                    reader.readAsText(file);
                  };
                  input.click();
                }} />
              </div>
              <AddBtn label="Download Excel Template" onClick={() => {
                const headers = ["name", "adm", "cls", "sec", "pen", "apaar", "rte", "phone", "gender", "dob", "category", "medium", "father", "mother", "address"];
                const example = ["Example Student Name", "BWS1001", "V", "A", "12345678901", "123456789012", "No", "9876543210", "Male", "2010-01-01", "OBC", "Hindi", "Rajesh Kumar", "Sunita Devi", "123 Main Street"];
                const worksheet = XLSX.utils.aoa_to_sheet([headers, example]);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
                XLSX.writeFile(workbook, "Student Import Template.xlsx");
              }} />
            </div>
          )}

          {view === "admissions" && (
            <div>
              <div style={S.card}>
                {F("name", "Child name")}{F("cls", "Class sought")}{F("parent", "Parent name")}{F("phone", "Phone")}{F("status", "Status: Enquiry / Admitted")}
                <AddBtn label="Add enquiry" onClick={() => form.name && addTo("enquiries", form)} />
              </div>
              <div style={S.card}>
                <Table cols={[["name", "Child"], ["cls", "Class"], ["parent", "Parent"], ["phone", "Phone"], ["status", "Status"]]}
                  rows={db.enquiries} onDel={(id) => delFrom("enquiries", id)} />
              </div>
            </div>
          )}

          {view === "attendance" && (
            <div style={S.card}>
              <div style={S.row}>
                <input style={{ ...S.input, maxWidth: 180 }} type="date" value={attDate} onChange={(e) => setAttDate(e.target.value)} />
                <select style={{ ...S.input, maxWidth: 140 }} value={attClass} onChange={(e) => setAttClass(e.target.value)}>
                  {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {db.students.filter((s) => s.cls === attClass).length === 0 && <p style={S.small}>No students in class {attClass} yet.</p>}
              {db.students.filter((s) => s.cls === attClass).map((s) => (
                <div key={s.id} style={{ ...S.row, justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e4ece4" }}>
                  <span>{s.name} ({s.adm || ""})</span>
                  <span>
                    {(["P", "A"] as const).map((v) => (
                      <button key={v} className={todayAtt[s.id] === v ? "btn" : "btn ghost"} style={{ marginLeft: 6 }}
                        onClick={() => set({ attendance: { ...db.attendance, [attDate]: { ...todayAtt, [s.id]: v } } })}>
                        {v === "P" ? "Present" : "Absent"}
                      </button>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          )}

          {view === "fees" && (
            <div>
              <div style={S.card}>
                <strong>Fee heads</strong>
                {F("head", "Fee head, e.g. Tuition")}{F("amount", "Amount (₹)", "number")}
                <AddBtn label="Add fee head" onClick={() => form.head && addTo("feeHeads", form)} />
                <Table cols={[["head", "Head"], ["amount", "₹"]]} rows={db.feeHeads} onDel={(id) => delFrom("feeHeads", id)} />
              </div>
              <div style={S.card}>
                <strong>Collect fee</strong>
                {F("student", "Student name")}{F("head", "Fee head")}{F("amount", "Amount (₹)", "number")}{F("date", "Date", "date")}
                <AddBtn label="Record payment" onClick={() => form.student && addTo("payments", form)} />
                <p style={S.small}>Collected so far: ₹{feesCollected.toLocaleString("en-IN")}</p>
                <Table cols={[["student", "Student"], ["head", "Head"], ["amount", "₹"], ["date", "Date"]]} rows={db.payments} onDel={(id) => delFrom("payments", id)} />
                <div style={{ marginTop: 12 }}>
                  {db.payments.map((p) => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #e4ece4" }}>
                      <span style={S.small}>{p.student} - {p.head} - ₹{p.amount}</span>
                      <button className="btn" onClick={() => {
                        const win = window.open("", "_blank");
                        if (!win) return;
                        win.document.write(`
                          <html><body style="font-family:sans-serif;padding:40px;">
                            <h2 style="text-align:center;">${db.settings.name || "School Receipt"}</h2>
                            <hr/>
                            <p><strong>Student:</strong> ${p.student}</p>
                            <p><strong>Fee Head:</strong> ${p.head}</p>
                            <p><strong>Amount:</strong> ₹${p.amount}</p>
                            <p><strong>Date:</strong> ${p.date}</p>
                            <p style="margin-top:40px;text-align:right;">Signature</p>
                          </body></html>
                        `);
                        win.document.close();
                        win.print();
                      }}>Print Receipt</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "staff" && (
            <div>
              <div style={S.card}>
                {F("name", "Staff name")}{F("role", "Role: Teacher / Office / Other")}{F("phone", "Phone")}{F("salary", "Monthly salary (₹)", "number")}
                <AddBtn label="Add staff" onClick={() => form.name && addTo("staff", form)} />
              </div>
              <div style={S.card}>
                <Table cols={[["name", "Name"], ["role", "Role"], ["phone", "Phone"], ["salary", "Salary ₹"]]} rows={db.staff} onDel={(id) => delFrom("staff", id)} />
              </div>
            </div>
          )}

          {view === "exams" && (
            <div>
              <div style={S.card}>
                {F("exam", "Exam name")}{F("student", "Student name")}{F("subject", "Subject")}{F("marks", "Marks", "number")}{F("max", "Max marks", "number")}
                <AddBtn label="Add marks" onClick={() => form.student && addTo("exams", form)} />
              </div>
              <div style={S.card}>
                <Table cols={[["exam", "Exam"], ["student", "Student"], ["subject", "Subject"], ["marks", "Marks"], ["max", "Max"]]} rows={db.exams} onDel={(id) => delFrom("exams", id)} />
              </div>
              <div style={{ marginTop: 12 }}>
                {db.students.map((student) => {
                  const studentExams = db.exams.filter((e) => e.student === student.name);
                  const total = studentExams.reduce((sum, e) => sum + (Number(e.marks) || 0), 0);
                  const maxTotal = studentExams.reduce((sum, e) => sum + (Number(e.max) || 0), 0);
                  const percentage = maxTotal > 0 ? (total / maxTotal * 100).toFixed(1) : "0.0";
                  return (
                    <div key={student.id} style={{ marginBottom: 16, padding: 12, border: "1px solid #d8e2d8", borderRadius: 12 }}>
                      <h4 style={{ margin: 0, fontSize: 14 }}>{student.name}</h4>
                      <p style={{ margin: "6px 0", fontSize: 13 }}>School: {db.settings.name || "EduCafe School"}</p>
                      <p style={{ margin: "4px 0", fontSize: 13 }}><strong>Subjects:</strong></p>
                      <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
                        {studentExams.map((e) => (
                          <li key={e.id} style={{ margin: "4px 0" }}>{e.subject}: {e.marks}/{e.max}</li>
                        ))}
                      </ul>
                      <p style={{ margin: "8px 0", fontWeight: 600, fontSize: 14 }}>Total: {total}/{maxTotal} — {percentage}%</p>
                      <button className="btn" onClick={() => {
                        const win = window.open("", "_blank");
                        if (!win) return;
                        win.document.write(String()
                          .concat("<html><body style='font-family:sans-serif;padding:40px;'>")
                          .concat("<h2 style='text-align:center;'>").concat(db.settings.name || "EduCafe School").concat("</h2>")
                          .concat("<p>Report Card - ").concat(student.name).concat("</p>")
                          .concat("<p>School: ").concat(db.settings.name || "EduCafe School").concat("</p>")
                          .concat("<p><strong>Subjects:</strong></p>")
                          .concat("<ul style='margin:0;padding-left:20;font-size:13;'>")
                          .concat(studentExams.map((e) => "<li style='margin:4px 0;'>" + e.subject + ": " + String(e.marks) + "/" + String(e.max) + "</li>").join(""))
                          .concat("</ul>")
                          .concat("<p style='margin:8px 0;font-weight:600;font-size:14;text-align:right;'>Total: ").concat(String(total)).concat("/").concat(String(maxTotal)).concat(" — ").concat(String(percentage)).concat("%</p>")
                          .concat("</body></html>"));
                      win.document.close();
                        win.print();
                      }}>Report Card</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === "certificates" && (
            <div>
              <div style={S.card}>
                {F("student", "Student name")}{F("type", "Type: TC / Bonafide / Character")}{F("date", "Date", "date")}{F("note", "Note")}
                <AddBtn label="Issue certificate" onClick={() => form.student && addTo("certificates", form)} />
              </div>
              <div style={S.card}>
                <Table cols={[["student", "Student"], ["type", "Type"], ["date", "Date"], ["note", "Note"]]} rows={db.certificates} onDel={(id) => delFrom("certificates", id)} />
              </div>
              <div style={{ marginTop: 12 }}>
                {db.certificates.map((cert) => (
                  <div key={cert.id} style={{ marginBottom: 16, padding: 12, border: "1px solid #d8e2d8", borderRadius: 12 }}>
                    <button className="btn" onClick={() => {
                      const printContent = String()
                        .concat("<html><body style='font-family:sans-serif;padding:40px;'>")
                        .concat("<h2 style='text-align:center;'>").concat(db.settings.name || "EduCafe School").concat("</h2>")
                        .concat("<p>").concat(cert.type).concat("</p>")
                        .concat("<p>Student: ").concat(cert.student).concat("</p>")
                        .concat("<p>Date: ").concat(cert.date).concat("</p>")
                        .concat(cert.note ? "<p>Note: ".concat(cert.note).concat("</p>") : "")
                        .concat("</body></html>");
                      const win = window.open("", "_blank");
                      if (!win) return;
                      win.document.write(printContent);
                      win.document.close();
                      win.print();
                    }}>Print Certificate</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "timetable" && (
            <div>
              <div style={S.card}>
                {F("cls", "Class")}{F("day", "Day")}{F("period", "Period number")}{F("subject", "Subject")}{F("teacher", "Teacher")}
                <AddBtn label="Add period" onClick={() => form.cls && addTo("periods", form)} />
              </div>
              <div style={S.card}>
                <Table cols={[["cls", "Class"], ["day", "Day"], ["period", "Period"], ["subject", "Subject"], ["teacher", "Teacher"]]} rows={db.periods} onDel={(id) => delFrom("periods", id)} />
              </div>
            </div>
          )}

          {view === "library" && (
            <div>
              <div style={S.card}>
                <strong>Books</strong>
                {F("title", "Book title")}{F("copies", "Copies", "number")}
                <AddBtn label="Add book" onClick={() => form.title && addTo("books", form)} />
                <Table cols={[["title", "Title"], ["copies", "Copies"]]} rows={db.books} onDel={(id) => delFrom("books", id)} />
              </div>
              <div style={S.card}>
                <strong>Issue book</strong>
                {F("title", "Book title")}{F("student", "Student name")}{F("date", "Issue date", "date")}
                <AddBtn label="Issue" onClick={() => form.title && addTo("issues", form)} />
                <Table cols={[["title", "Book"], ["student", "Student"], ["date", "Date"]]} rows={db.issues} onDel={(id) => delFrom("issues", id)} />
              </div>
            </div>
          )}

          {view === "transport" && (
            <div>
              <div style={S.card}>
                {F("route", "Route name")}{F("stop", "Stop")}{F("student", "Student name")}
                <AddBtn label="Add stop / student" onClick={() => form.route && addTo("routes", form)} />
              </div>
              <div style={S.card}>
                <Table cols={[["route", "Route"], ["stop", "Stop"], ["student", "Student"]]} rows={db.routes} onDel={(id) => delFrom("routes", id)} />
              </div>
            </div>
          )}

          {view === "accounts" && (
            <div>
              <div style={S.card}>
                {F("kind", "Kind: Income / Expense")}{F("label", "Label")}{F("amount", "Amount (₹)", "number")}{F("date", "Date", "date")}
                <AddBtn label="Add entry" onClick={() => form.label && addTo("ledger", form)} />
                <p style={S.small}>Balance: ₹{ledgerBal.toLocaleString("en-IN")}</p>
              </div>
              <div style={S.card}>
                <Table cols={[["kind", "Kind"], ["label", "Label"], ["amount", "₹"], ["date", "Date"]]} rows={db.ledger} onDel={(id) => delFrom("ledger", id)} />
              </div>
            </div>
          )}

          {view === "gate" && (
            <div>
              <div style={S.card}>
                {F("name", "Visitor / student name")}{F("purpose", "Purpose")}{F("time", "Time")}
                <AddBtn label="Add entry" onClick={() => form.name && addTo("gate", form)} />
              </div>
              <div style={S.card}>
                <Table cols={[["name", "Name"], ["purpose", "Purpose"], ["time", "Time"]]} rows={db.gate} onDel={(id) => delFrom("gate", id)} />
              </div>
            </div>
          )}

          {view === "inventory" && (
            <div>
              <div style={S.card}>
                {F("item", "Item")}{F("qty", "Quantity", "number")}{F("note", "Note")}
                <AddBtn label="Add item" onClick={() => form.item && addTo("stock", form)} />
              </div>
              <div style={S.card}>
                <Table cols={[["item", "Item"], ["qty", "Qty"], ["note", "Note"]]} rows={db.stock} onDel={(id) => delFrom("stock", id)} />
              </div>
            </div>
          )}

          {view === "govt" && (
            <div style={S.card}>
              <p><strong>UDISE+ readiness:</strong> {db.students.length} students, {db.students.filter((s) => s.pen).length} with PEN, {db.students.filter((s) => s.adm).length} with admission number.</p>
              <p><strong>APAAR:</strong> {db.students.filter((s) => s.apaar).length} students have an APAAR ID recorded, {db.students.filter((s) => !s.apaar).length} without.</p>
              <p><strong>RTE:</strong> {db.students.filter((s) => (s.rte || "").toLowerCase() === "yes").length} students marked RTE Yes.</p>
              <p style={S.small}>Add PEN, APAAR and RTE on each student record in Students, and these counts stay ready for the government portals.</p>
            </div>
          )}

          {view === "notices" && (
            <div>
              <div style={S.card}>
                {F("title", "Notice title")}{F("date", "Date", "date")}{F("body", "Notice text")}
                <AddBtn label="Add notice" onClick={() => form.title && addTo("notices", form)} />
              </div>
              <div style={S.card}>
                <Table cols={[["title", "Title"], ["date", "Date"], ["body", "Text"]]} rows={db.notices} onDel={(id) => delFrom("notices", id)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
