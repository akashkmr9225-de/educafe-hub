import { $, input, setHTML, setMsg } from "./helpers";
import { T, getLang, onLangChange } from "./state";


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

