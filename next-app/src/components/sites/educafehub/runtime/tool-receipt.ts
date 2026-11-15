import { $, chipGroup, downloadBlob, input, setMsg } from "./helpers";
import { T, pulse, store } from "./state";

const RK = "educafehub_rcpt_no";

interface RcItem {
  n: string;
  a: number;
}

interface ReceiptState {
  pay: string;
}

export function initReceipt(): void {
  const rc: ReceiptState = { pay: "Cash" };

  function rcRows(): RcItem[] {
    const out: RcItem[] = [];
    document.querySelectorAll("#rcItems .rcrow").forEach((r) => {
      const n = (r.querySelector(".rcn") as HTMLInputElement).value.trim();
      const a = parseFloat((r.querySelector(".rca") as HTMLInputElement).value) || 0;
      if (n || a > 0) out.push({ n: n || "Item", a });
    });
    return out;
  }

  function rcTotalCalc(): number {
    const t = rcRows().reduce((x, i) => x + i.a, 0);
    $("rcTotal").textContent = String(t);
    return t;
  }

  function rcAddRow(nm?: string, amt?: number): void {
    const row = document.createElement("div");
    row.className = "rcrow";
    const n = document.createElement("input");
    n.type = "text";
    n.className = "rcn";
    n.placeholder = T("rcItemPh");
    if (nm) n.value = nm;
    const a = document.createElement("input");
    a.type = "number";
    a.className = "rca";
    a.min = "0";
    a.placeholder = T("rcAmtPh");
    if (amt) a.value = String(amt);
    const del = document.createElement("button");
    del.type = "button";
    del.className = "del";
    del.textContent = "✕";
    del.setAttribute("aria-label", "Remove item");
    del.addEventListener("click", () => {
      row.remove();
      rcTotalCalc();
    });
    a.addEventListener("input", rcTotalCalc);
    row.appendChild(n);
    row.appendChild(a);
    row.appendChild(del);
    $("rcItems").appendChild(row);
  }

  function rcText(): string {
    const items = rcRows();
    const total = rcTotalCalc();
    const L = [
      `${input("rcShop").value || "EduCafe Hub"}`,
      `${T("rcNoL")} ${input("rcNo").value} · ${input("rcDate").value}`,
    ];
    if (input("rcCust").value.trim()) L.push(`${T("rcFor")}: ${input("rcCust").value.trim()}`);
    L.push("——————");
    items.forEach((i) => L.push(`${i.n} — ₹${i.a}`));
    L.push("——————", `${T("rcTotalL")}: ₹${total} (${rc.pay})`, T("rcThanks"));
    return L.join("\n");
  }

  $("rcAdd").addEventListener("click", function (this: HTMLElement) {
    rcAddRow();
    pulse(this);
  });

  $("rcCopy").addEventListener("click", async function (this: HTMLElement) {
    const msg = $("rcMsg");
    if (!rcRows().length) {
      setMsg("rcMsg", T("rcNeedItem"), "warn");
      return;
    }
    const txt = rcText();
    let ok = false;
    try {
      await navigator.clipboard.writeText(txt);
      ok = true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
    }
    msg.textContent = ok ? T("rcCopied") : "";
    msg.className = "msg good";
    if (ok) pulse(this);
  });

  $("rcGo").addEventListener("click", async function (this: HTMLElement) {
    const items = rcRows();
    if (!items.length) {
      setMsg("rcMsg", T("rcNeedItem"), "warn");
      return;
    }
    const total = rcTotalCalc();
    const W = 680;
    const pad = 38;
    const H = 308 + items.length * 36;
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const cx = cv.getContext("2d");
    if (!cx) return;
    cx.fillStyle = "#ffffff";
    cx.fillRect(0, 0, W, H);
    cx.fillStyle = "#152420";
    cx.textAlign = "center";
    cx.font = "800 31px 'Bricolage Grotesque','Public Sans',sans-serif";
    cx.fillText(input("rcShop").value || "EduCafe Hub", W / 2, 56);
    cx.font = "500 15px 'Public Sans',sans-serif";
    cx.fillStyle = "#50625a";
    cx.fillText("EduCafe Hub · educafehub.com", W / 2, 84);
    cx.strokeStyle = "#d3ddd5";
    cx.lineWidth = 2;
    cx.beginPath();
    cx.moveTo(pad, 104);
    cx.lineTo(W - pad, 104);
    cx.stroke();
    cx.textAlign = "left";
    cx.fillStyle = "#152420";
    cx.font = "600 16px 'Public Sans',sans-serif";
    cx.fillText(`${T("rcNoL")} ${input("rcNo").value}`, pad, 134);
    cx.textAlign = "right";
    cx.fillText(input("rcDate").value, W - pad, 134);
    cx.textAlign = "left";
    let y = 162;
    if (input("rcCust").value.trim()) {
      cx.fillText(`${T("rcFor")}: ${input("rcCust").value.trim()}`, pad, y);
      y += 30;
    }
    cx.beginPath();
    cx.moveTo(pad, y - 12);
    cx.lineTo(W - pad, y - 12);
    cx.stroke();
    cx.font = "500 17px 'Public Sans',sans-serif";
    items.forEach((i) => {
      cx.fillText(i.n, pad, y + 12);
      cx.textAlign = "right";
      cx.fillText(`₹${i.a}`, W - pad, y + 12);
      cx.textAlign = "left";
      y += 36;
    });
    cx.beginPath();
    cx.moveTo(pad, y - 8);
    cx.lineTo(W - pad, y - 8);
    cx.stroke();
    cx.font = "800 20px 'Public Sans',sans-serif";
    cx.fillText(T("rcTotalL"), pad, y + 24);
    cx.textAlign = "right";
    cx.fillText(`₹${total}`, W - pad, y + 24);
    cx.textAlign = "left";
    cx.font = "500 15px 'Public Sans',sans-serif";
    cx.fillStyle = "#50625a";
    cx.fillText(`${T("rcPayL")}: ${rc.pay}`, pad, y + 54);
    cx.textAlign = "center";
    cx.font = "700 17px 'Public Sans',sans-serif";
    cx.fillStyle = "#0b6e5d";
    cx.fillText(T("rcThanks"), W / 2, y + 88);
    const blob = await new Promise<Blob | null>((r) => cv.toBlob(r, "image/png"));
    if (!blob) return;
    downloadBlob(blob, `receipt-${input("rcNo").value}.png`);
    const n = (store.get<number>(RK) || 1000) + 1;
    store.set(RK, n);
    input("rcNo").value = `ECH-${n}`;
    $("rcMsg").textContent = "";
    pulse(this);
  });

  rc.pay =
    chipGroup("rcPay", (v) => {
      rc.pay = v;
    }) || "Cash";

  const iso = new Date().toISOString().slice(0, 10);
  input("rcDate").value = iso;
  let n = store.get<number>(RK);
  if (!n) {
    n = 1001;
    store.set(RK, n);
  }
  input("rcNo").value = `ECH-${n}`;
  rcAddRow();
}
