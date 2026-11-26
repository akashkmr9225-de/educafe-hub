"use client";
import { useEffect, useMemo, useState } from "react";

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

  const mod = MODULES.find((m) => m.id === view)!;

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
            </div>
          )}

          {view === "students" && (
            <div>
              <div style={S.card}>
                {F("name", "Student name")}{F("adm", "Admission number")}{F("cls", "Class (I to XII)")}{F("sec", "Section")}
                {F("pen", "PEN number")}{F("apaar", "APAAR ID")}{F("rte", "RTE: Yes / No")}{F("phone", "Guardian phone")}
                <AddBtn label="Add student" onClick={() => form.name && addTo("students", form)} />
              </div>
              <div style={S.card}>
                <Table cols={[["name", "Name"], ["adm", "Adm No"], ["cls", "Class"], ["sec", "Sec"], ["pen", "PEN"], ["apaar", "APAAR"], ["rte", "RTE"], ["phone", "Phone"]]}
                  rows={db.students} onDel={(id) => delFrom("students", id)} />
              </div>
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
