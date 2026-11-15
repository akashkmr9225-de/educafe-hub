import { $, input, setHTML, setMsg } from "./helpers";
import { T } from "./state";

interface AgeParts {
  y: number;
  m: number;
  d: number;
}

function ageDiff(dob: Date, on: Date): AgeParts {
  let y = on.getFullYear() - dob.getFullYear();
  let m = on.getMonth() - dob.getMonth();
  let d = on.getDate() - dob.getDate();
  if (d < 0) {
    m--;
    const prev = new Date(on.getFullYear(), on.getMonth(), 0);
    d += prev.getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  return { y, m, d };
}

function ageStr(a: AgeParts): string {
  return `${a.y} saal, ${a.m} mahina, ${a.d} din`;
}

export function initAge(): void {
  input("ageOn").value = new Date().toISOString().slice(0, 10);
  $("ageGo").addEventListener("click", () => {
    const dv = input("ageDob").value;
    const ov = input("ageOn").value;
    if (!dv) {
      setMsg("ageMsg", "Pehle Date of Birth select karo.", "warn");
      return;
    }
    const dob = new Date(`${dv}T00:00:00`);
    const on = ov ? new Date(`${ov}T00:00:00`) : new Date();
    if (dob > on) {
      setMsg("ageMsg", "DOB, “kis date par” wali date se aage hai — check karo.", "warn");
      return;
    }
    $("ageMsg").textContent = "";
    const a = ageDiff(dob, on);
    $("ageBig").textContent = ageStr(a);
    $("ageLine").textContent = `DOB: ${dob.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · Umar is date par: ${on.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
    const yr = on.getFullYear();
    $("ageMar").textContent = `${ageStr(ageDiff(dob, new Date(yr, 2, 31)))} (${yr})`;
    $("ageDec").textContent = `${ageStr(ageDiff(dob, new Date(yr, 11, 31)))} (${yr})`;
    $("ageDays").textContent = `${Math.floor((on.getTime() - dob.getTime()) / 86400000).toLocaleString("en-IN")} din`;
    const next = new Date(on.getFullYear(), dob.getMonth(), dob.getDate());
    if (next <= on) next.setFullYear(next.getFullYear() + 1);
    const nd = Math.ceil((next.getTime() - on.getTime()) / 86400000);
    $("ageNext").textContent = `${next.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} (${nd} din baad)`;
    $("ageKv").style.display = "grid";
  });
}

function mkRow(name: string): void {
  const rmTxt = T("mkRemove") || "Remove";
  const rmAria = T("mkRemoveAria") || "Remove subject";
  const tr = document.createElement("tr");
  tr.innerHTML = `<td><input type="text" class="mkName" placeholder="Subject" value="${name || ""}"></td><td><input type="number" class="mkMax" min="1" placeholder="100"></td><td><input type="number" class="mkObt" min="0" placeholder="0"></td><td><button type="button" class="del" data-i18n-aria="mkRemoveAria" aria-label="${rmAria}"><span aria-hidden="true">×</span> <span data-i18n="mkRemove">${rmTxt}</span></button></td>`;
  const del = tr.querySelector<HTMLButtonElement>(".del");
  del?.addEventListener("click", () => tr.remove());
  $("mkBody").appendChild(tr);
}

export function initMarks(): void {
  ["Hindi", "English", "Maths", "Science", "Social Science", "Sanskrit"].forEach((s) =>
    mkRow(s),
  );
  $("mkAdd").addEventListener("click", () => mkRow(""));
  $("mkGo").addEventListener("click", () => {
    const rows = Array.from($("mkBody").querySelectorAll("tr"));
    let totM = 0;
    let totO = 0;
    let used = 0;
    let fail = false;
    rows.forEach((tr) => {
      const mx = parseFloat((tr.querySelector(".mkMax") as HTMLInputElement).value);
      const ob = parseFloat((tr.querySelector(".mkObt") as HTMLInputElement).value);
      if (!isNaN(mx) && !isNaN(ob) && mx > 0) {
        totM += mx;
        totO += ob;
        used++;
        if (ob < mx * 0.33) fail = true;
      }
    });
    if (!used || totM === 0) {
      setMsg("mkMsg", "Kam se kam ek subject ka Max aur Obtained number daalo.", "warn");
      $("mkResult").style.display = "none";
      return;
    }
    $("mkMsg").textContent = "";
    const pct = (totO / totM) * 100;
    $("mkBig").textContent = `${pct.toFixed(2)}%`;
    $("mkTot").textContent = `${totO} / ${totM}`;
    $("mkDiv").textContent =
      pct >= 60 ? "First (प्रथम)" : pct >= 45 ? "Second (द्वितीय)" : pct >= 33 ? "Third (तृतीय)" : "—";
    $("mkGrade").textContent =
      pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B+" : pct >= 60 ? "B" : pct >= 50 ? "C" : pct >= 40 ? "D" : pct >= 33 ? "E" : "F";
    $("mkPass").textContent = fail ? "Fail (koi subject 33% se kam)" : pct >= 33 ? "Pass ✔" : "Fail";
    $("mkResult").style.display = "block";
  });

  let cgLock = false;
  input("cgpaIn").addEventListener("input", function (this: HTMLInputElement) {
    if (cgLock) return;
    cgLock = true;
    const v = parseFloat(this.value);
    if (!isNaN(v) && v >= 0 && v <= 10) {
      input("pctIn").value = (v * 9.5).toFixed(1);
      $("cgpaOut").textContent = `CGPA ${v} = ${(v * 9.5).toFixed(1)}%`;
    }
    cgLock = false;
  });
  input("pctIn").addEventListener("input", function (this: HTMLInputElement) {
    if (cgLock) return;
    cgLock = true;
    const v = parseFloat(this.value);
    if (!isNaN(v) && v >= 0 && v <= 100) {
      input("cgpaIn").value = (v / 9.5).toFixed(2);
      $("cgpaOut").textContent = `${v}% = CGPA ${(v / 9.5).toFixed(2)}`;
    }
    cgLock = false;
  });
}

const PC: [string, string, string][] = [
  ["pcBw", "pcBwR", "pcBwL"],
  ["pcCol", "pcColR", "pcColL"],
  ["pcPh", "pcPhR", "pcPhotoL"],
  ["pcLam", "pcLamR", "pcLamL"],
  ["pcFm", "pcFmR", "pcFormL"],
];

export function initPrintCost(): void {
  PC.forEach((r) => {
    input(r[0]).addEventListener("input", pcCalc);
    input(r[1]).addEventListener("input", pcCalc);
  });
  pcCalc();
}

export function pcCalc(): void {
  let total = 0;
  let html = "";
  PC.forEach((r) => {
    const c = parseFloat(input(r[0]).value) || 0;
    const rate = parseFloat(input(r[1]).value) || 0;
    const amt = c * rate;
    total += amt;
    if (c > 0) html += `<div><dt>${T(r[2])}</dt><dd>₹${amt}</dd></div>`;
  });
  setHTML("pcBreak", html);
  $("pcTotal").textContent = String(total);
}
