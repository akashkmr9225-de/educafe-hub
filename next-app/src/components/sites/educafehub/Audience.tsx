export function EarnSection() {
  return (
    <section id="earn">
      <div className="sec-head">
        <span className="no">₹</span>
        <h2 data-i18n="earnTitle">Paise kaise kamayein? Kaun paise dega?</h2>
      </div>
      <p className="sec-sub" data-i18n="earnDesc">
        Seedhi baat: koi website khud paise nahi deti. Paise aate hain — ads dikhane par advertisers
        se, ya dukaan par service charge se. Dono ke asal numbers neeche hain.
      </p>
      <div className="guidegrid">
        <div className="card">
          <h3 data-i18n="earn1T">1) 💰 Google AdSense</h3>
          <p data-i18n="earn1D">
            Traffic badhne ke baad AdSense approval milta hai, phir ads se kamai hoti hai. India
            mein aam taur par 1,000 pageviews par lagbhag ₹40–₹200 mil sakta hai — topic aur season
            par nirbhar. Pehle 500–1,000 roz ke visitors lao, phir apply karo.
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="earn2T">2) 🏪 Local ads — seedha paisa</h3>
          <p data-i18n="earn2D">
            Aas-paas ki coaching, mobile dukaan, coaching centre se banner/spot ke ₹500–₹2,000 per
            month le sakte ho. Ye AdSense se pehle aur zyada bharosemand kamai hai — bill/receipt ke
            saath deal pakki karo.
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="earn3T">3) 🖨️ Dukaan par service charge</h3>
          <p data-i18n="earn3D">
            Asli kamai yahi hai: passport photo sheet ₹30–₹50, form ke liye photo resize/print
            ₹10–₹30, PDF print ₹5–₹10 per page. Tool free hai, lekin print, paper aur aapka time —
            uska charge customer deta hai.
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="earn4T">4) 🔗 Affiliate + Donation</h3>
          <p data-i18n="earn4D">
            Photo paper, printer ink, pen drive jaisi cheezon ke affiliate links aur ek chhota sa
            support/donation button bhi jod sakte ho. Income chhoti hoti hai, par zero cost par
            extra hai.
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="earn5T">⚠️ Jhoothe waadon se bacho</h3>
          <p data-i18n="earn5D">
            “Guaranteed income”, “ek click mein lakhon”, fake CPC ya khud apne ads par click karne
            wali tricks — in sab se bacho. AdSense aisi harkat par account hamesha ke liye band kar
            deta hai. Koi bhi kamai pakki nahi hoti; pehle visitors, phir paisa.
          </p>
        </div>
      </div>
      <div className="guidegrid" style={{ marginTop: 14 }}>
        <div className="card">
          <h3 data-i18n="earnP0T">Phase 0 — Now (free, no login)</h3>
          <p data-i18n="earnP0D">
            Today&apos;s income is the counter only: photo/PDF service charges and local banners
            (cards 2 and 3 above). The site stays free and no account is needed.
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="earnP1T">Phase 1 — With your own domain</h3>
          <p data-i18n="earnP1D">
            Once the .com domain is in place, apply for Google AdSense — it asks for a Privacy
            Policy and Terms, which now exist in the Legal section at the bottom of this page. After
            approval, ads pay per view and click.
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="earnP2T">Phase 2 — After login launches</h3>
          <p data-i18n="earnP2D">
            Only after login exists could any optional paid extra be considered — such as
            bulk/batch jobs or an ad-free option — and only if real users actually come. The basic
            tools stay free.
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="earnLoginT">🔐 What login will unlock later</h3>
          <p data-i18n="earnLoginD">
            Saved tasks, a work history, favourite tools and your settings on every device. That
            needs the domain plus a small server, so it comes after the domain — see the Login
            Roadmap below.
          </p>
        </div>
      </div>
    </section>
  );
}

export function GrowSection() {
  return (
    <section id="grow">
      <div className="sec-head">
        <span className="no">＋</span>
        <h2 data-i18n="growTitle">Naya feature kaise jodein — aage ka roadmap</h2>
      </div>
      <p className="sec-sub" data-i18n="growDesc">
        Ye site ek hi file (index.html) mein hai, isliye naya tool jodna aasan hai — coding ka basic
        tareeka jaan lo to khud bhi jod sakte ho.
      </p>
      <div className="guidegrid">
        <div className="card">
          <h3 data-i18n="grow1T">Feature jodne ke 5 step</h3>
          <ol>
            <li data-i18n="growS1">
              Upar nav mein ek naya link jodo: &lt;a href=&quot;#mytool&quot;&gt;My Tool&lt;/a&gt;
            </li>
            <li data-i18n="growS2">
              Ek naya &lt;section id=&quot;mytool&quot;&gt; banao — kisi purane tool ka section copy
              karke badal do.
            </li>
            <li data-i18n="growS3">
              Uske liye chhota sa JavaScript likho — file hamesha browser mein hi process karo,
              server par mat bhejo.
            </li>
            <li data-i18n="growS4">
              Dono bhashaon ke liye I18N dictionary mein uski EN aur HI entry jodo.
            </li>
            <li data-i18n="growS5">
              Test karo, phir file ko dobara deploy karo (neeche Free Live wale steps).
            </li>
          </ol>
        </div>
        <div className="card">
          <h3 data-i18n="grow2T">Agle feature ideas (priority order)</h3>
          <ul>
            <li data-i18n="growI1">QR code generator (UPI / link ke liye)</li>
            <li data-i18n="growI2">Aadhaar / PAN card size print layout</li>
            <li data-i18n="growI3">Hindi typing tool (English → Hindi unicode)</li>
            <li data-i18n="growI4">Resume / biodata maker (school jobs ke liye)</li>
            <li data-i18n="growI5">Barcode generator aur lamination size presets</li>
          </ul>
        </div>
        <div className="card">
          <h3 data-i18n="grow3T">Madad kahan milegi?</h3>
          <p data-i18n="grow3D">
            Filee jaisi open-source projects ko GitHub par padho, code copy karne se pehle uska
            license dekho. Naya feature chahiye to kisi bhi AI/developer ko bolo: “index.html mein
            ek naya section + JS tool jodo, browser-only rakho, EN/HI dono text ke saath.”
          </p>
        </div>
      </div>
    </section>
  );
}

export function GoLiveSection() {
  return (
    <section id="golive">
      <div className="sec-head">
        <span className="no">🚀</span>
        <h2 data-i18n="liveTitle">Free mein live kaise karein — step by step</h2>
      </div>
      <p className="sec-sub" data-i18n="liveDesc">
        Ye static site hai, isliye hosting bilkul free hai aur server ka kharcha zero. Apna domain
        (jaise educafehub.com) bhi free mein jod sakte ho.
      </p>
      <div className="guidegrid">
        <div className="card">
          <h3 data-i18n="liveCard1T">Cloudflare Pages (recommended)</h3>
          <ol>
            <li data-i18n="liveC1">dash.cloudflare.com par free account banao</li>
            <li data-i18n="liveC2">Workers &amp; Pages → Create → Pages → Upload assets</li>
            <li data-i18n="liveC3">index.html (aur assets folder) upload karo — Deploy dabao</li>
            <li data-i18n="liveC4">
              Custom domain mein apna domain jodo; HTTPS apne-aap free mil jata hai
            </li>
          </ol>
        </div>
        <div className="card">
          <h3 data-i18n="liveCard2T">Netlify / GitHub Pages (alternatives)</h3>
          <ol>
            <li data-i18n="liveN1">
              Netlify: app.netlify.com/drop par folder drag-drop karo — turant live link mil jata
              hai
            </li>
            <li data-i18n="liveN2">
              GitHub Pages: repo banao, index.html upload karo, Settings → Pages → Branch: main
            </li>
            <li data-i18n="liveN3">
              Teeno par SSL (HTTPS) free hai, bandwidth bhi aam traffic ke liye free hai
            </li>
            <li data-i18n="liveN4">
              Load: saara kaam visitor ke browser mein hota hai, isliye server load ~zero rehta hai
              — hazaron visitors par bhi site slow nahi hoti
            </li>
          </ol>
        </div>
        <div className="card">
          <h3 data-i18n="live3T">Update kaise karoge?</h3>
          <p data-i18n="live3D">
            Nayi index.html banao, wahi file dobara upload/deploy kar do — site 1 minute mein update
            ho jati hai. Purani file ki ek copy hamesha apne paas backup mein rakho.
          </p>
        </div>
      </div>
    </section>
  );
}
