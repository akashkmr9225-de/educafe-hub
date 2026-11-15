import { $, chipGroup, input, setHTML, setMsg } from "./helpers";

interface QrState {
  type: string;
  size: number;
  sec: string;
}

export function initQr(): void {
  const qr: QrState = { type: "upi", size: 512, sec: "WPA" };
  chipGroup("qrType", (v) => {
    qr.type = v;
    $("qrFldUpi").hidden = v !== "upi";
    $("qrFldLink").hidden = v !== "link";
    $("qrFldWifi").hidden = v !== "wifi";
  });
  chipGroup("qrSize", (v) => {
    qr.size = parseInt(v, 10);
  });
  chipGroup("qrWifiSec", (v) => {
    qr.sec = v;
  });

  function qrEsc(s: string): string {
    return (s || "").replace(/([\\;,":])/g, "\\$1");
  }

  function qrPayload(): string | null {
    if (qr.type === "upi") {
      const id = input("qrUpiId").value.trim();
      if (!id) return null;
      const name = input("qrUpiName").value.trim();
      const amt = parseFloat(input("qrUpiAmt").value);
      let u = `upi://pay?pa=${encodeURIComponent(id)}`;
      if (name) u += `&pn=${encodeURIComponent(name)}`;
      if (amt > 0) u += `&am=${amt.toFixed(2)}&cu=INR`;
      return u;
    }
    if (qr.type === "wifi") {
      const ssid = input("qrWifiSsid").value.trim();
      if (!ssid) return null;
      const pass = input("qrWifiPass").value;
      if (qr.sec === "nopass") return `WIFI:T:nopass;S:${qrEsc(ssid)};;`;
      return `WIFI:T:${qr.sec};S:${qrEsc(ssid)};P:${qrEsc(pass)};;`;
    }
    const t = input("qrText").value.trim();
    return t || null;
  }

  $("qrGo").addEventListener("click", () => {
    if (!window.QRCode) {
      setMsg(
        "qrMsg",
        "QR library load nahi hui — net connection check karke page refresh karo.",
        "warn",
      );
      return;
    }
    const payload = qrPayload();
    if (!payload) {
      setMsg(
        "qrMsg",
        qr.type === "upi"
          ? "Pehle UPI ID likho — bina ID ke QR nahi banega."
          : qr.type === "wifi"
            ? "Pehle Wi-Fi ka naam (SSID) likho."
            : "Pehle link ya text likho.",
        "warn",
      );
      return;
    }
    const out = $("qrOut");
    out.innerHTML = "";
    try {
      new window.QRCode(out, {
        text: payload,
        width: qr.size,
        height: qr.size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.M,
      });
    } catch {
      setMsg("qrMsg", "Ye text QR ke liye bahut lamba hai — chhota karke try karo.", "warn");
      return;
    }
    $("qrPreview").classList.add("show");
    const kind = qr.type === "upi" ? "UPI payment" : qr.type === "wifi" ? "Wi-Fi" : "Link / text";
    setHTML("qrStat", `<span class='good'>${kind} QR</span><span>${qr.size}×${qr.size} px</span>`);
    const cv = out.querySelector("canvas");
    const dl = $("qrDownload") as HTMLAnchorElement;
    if (cv && cv.toBlob) {
      cv.toBlob((b) => {
        if (b) {
          dl.href = URL.createObjectURL(b);
          dl.style.display = "inline-flex";
        }
      }, "image/png");
    }
    setMsg("qrMsg", "✔ QR taiyaar hai — apne phone se scan karke ek baar test zaroor karo.", "good");
  });
}
