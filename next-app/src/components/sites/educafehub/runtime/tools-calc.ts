import { $, input, setHTML, setMsg } from "./helpers";
import { T, getLang, onLangChange } from "./state";

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
  return T("ageStrFmt")
    .replace("{y}", String(a.y))
    .replace("{m}", String(a.m))
    .replace("{d}", String(a.d));
}

export function initAge(): void {
  input("ageOn").value = new Date().toISOString().slice(0, 10);
  const calcAge = () => {
    const dv = input("ageDob").value;
    const ov = input("ageOn").value;
    if (!dv) {
      setMsg("ageMsg", T("ageNeedDob"), "warn");
      return;
    }
    const dob = new Date(`${dv}T00:00:00`);
    const on = ov ? new Date(`${ov}T00:00:00`) : new Date();
    if (dob > on) {
      setMsg("ageMsg", T("ageDobFuture"), "warn");
      return;
    }
    $("ageMsg").textContent = "";
    const a = ageDiff(dob, on);
    $("ageBig").textContent = ageStr(a);
    const loc = getLang() === "hi" ? "hi-IN-u-nu-latn" : "en-IN";
    const fmtD = (d: Date) =>
      d.toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" });
    $("ageLine").textContent = T("ageLineFmt").replace("{dob}", fmtD(dob)).replace("{on}", fmtD(on));
    const yr = on.getFullYear();
    const marThis = new Date(yr, 2, 31);
    const admYear = marThis <= on ? yr + 1 : yr;
    const marAge = ageDiff(dob, new Date(admYear, 2, 31));
    $("ageMar").textContent = T("ageMarFmt").replace("{age}", ageStr(marAge)).replace("{y}", String(admYear));
    const c1 = $("ageClass1");
    const eligible = marAge.y >= 6;
    c1.style.display = "block";
    c1.className = `msg ${eligible ? "good" : "warn"}`;
    c1.textContent = T(eligible ? "ageClass1Ok" : "ageClass1No")
      .replace("{age}", ageStr(marAge))
      .replace("{y}", String(admYear));
    $("ageDec").textContent = `${ageStr(ageDiff(dob, new Date(yr, 11, 31)))} (${yr})`;
    $("ageDays").textContent = T("ageDaysFmt").replace(
      "{n}",
      Math.floor((on.getTime() - dob.getTime()) / 86400000).toLocaleString("en-IN"),
    );
    const next = new Date(on.getFullYear(), dob.getMonth(), dob.getDate());
    if (next <= on) next.setFullYear(next.getFullYear() + 1);
    const nd = Math.ceil((next.getTime() - on.getTime()) / 86400000);
    $("ageNext").textContent = T("ageNextFmt").replace("{date}", fmtD(next)).replace("{n}", String(nd));
    $("ageKv").style.display = "grid";
  };
  $("ageGo").addEventListener("click", calcAge);
  onLangChange(() => {
    if (input("ageDob").value && $("ageKv").style.display !== "none") calcAge();
  });
}

function mkRow(name: string): void {
  const rmTxt = T("mkRemove") || "Remove";
  const rmAria = T("mkRemoveAria") || "Remove subject";
  const tr = document.createElement("tr");
  tr.innerHTML = `<td><input type="text" class="mkName" placeholder="${T("mkSubjectPh")}" value="${name || ""}"></td><td><input type="number" class="mkMax" min="1" placeholder="100"></td><td><input type="number" class="mkObt" min="0" placeholder="0"></td><td><button type="button" class="del" data-i18n-aria="mkRemoveAria" aria-label="${rmAria}"><span aria-hidden="true">×</span> <span data-i18n="mkRemove">${rmTxt}</span></button></td>`;
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
      setMsg("mkMsg", T("mkNeedRow"), "warn");
      $("mkResult").style.display = "none";
      return;
    }
    $("mkMsg").textContent = "";
    const pct = (totO / totM) * 100;
    $("mkBig").textContent = `${pct.toFixed(2)}%`;
    $("mkTot").textContent = `${totO} / ${totM}`;
    $("mkDiv").textContent =
      pct >= 60 ? T("mkDiv1") : pct >= 45 ? T("mkDiv2") : pct >= 33 ? T("mkDiv3") : "—";
    $("mkGrade").textContent =
      pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B+" : pct >= 60 ? "B" : pct >= 50 ? "C" : pct >= 40 ? "D" : pct >= 33 ? "E" : "F";
    $("mkPass").textContent = fail ? T("mkPassFailSub") : pct >= 33 ? T("mkPassOk") : T("mkPassFail");
    $("mkResult").style.display = "block";
  });
  onLangChange(() => {
    if ($("mkResult").style.display !== "none") ($("mkGo") as HTMLButtonElement).click();
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
