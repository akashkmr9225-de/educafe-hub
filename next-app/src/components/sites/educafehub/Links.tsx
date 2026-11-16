import { Fragment } from "react";
import linksData from "@/data/links.json";
import type { LinkGroup } from "@/types/educafe";

const groups = linksData as LinkGroup[];

// Real site logos (fetched from the sites themselves / official files, self-hosted).
// Hosts not in this map keep their emoji.
const LOGOS: Record<string, string> = {
  "udiseplus.gov.in": "udiseplus.gov.in.png",
  "ncert.nic.in": "ncert.nic.in.png",
  "scholarships.gov.in": "scholarships.gov.in.png",
  "brabu.ac.in": "brabu.ac.in.png",
  "diksha.gov.in": "diksha.gov.in.ico",
  "myaadhaar.uidai.gov.in": "myaadhaar.uidai.gov.in.ico",
  "www.digilocker.gov.in": "www.digilocker.gov.in.png",
  "www.incometax.gov.in": "www.incometax.gov.in.png",
  "voters.eci.gov.in": "voters.eci.gov.in.png",
  "serviceonline.bihar.gov.in": "serviceonline.bihar.gov.in.png",
  "biharbhumi.bihar.gov.in": "biharbhumi.bihar.gov.in.png",
  "pmkisan.gov.in": "pmkisan.gov.in.ico",
  "eshram.gov.in": "eshram.gov.in.png",
  "www.indiapost.gov.in": "www.indiapost.gov.in.png",
  "mail.google.com": "mail.google.com.png",
  "web.whatsapp.com": "web.whatsapp.com.png",
  "www.canva.com": "www.canva.com.jpg",
  "maps.google.com": "maps.google.com.png",
  "www.sarkariresult.com": "www.sarkariresult.com.png",
  "ssc.gov.in": "ssc.gov.in.ico",
  "www.cbse.gov.in": "www.cbse.gov.in.png",
  "biharboardonline.com": "biharboardonline.com.ico",
  "parivahan.gov.in": "parivahan.gov.in.png",
  "www.ibps.in": "www.ibps.in.png",
};

export function LinksSection() {
  return (
    <section id="links">
      <div className="sec-head">
        <span className="no">Daily</span>
        <h2 data-i18n="sections.dailyLinks">Daily Websites — One Click</h2>
      </div>
      <p className="sec-sub" data-i18n="linksDesc">Official websites opened daily in a school office and cyber cafe. Type a name to filter.</p>
      <input
        className="searchlinks"
        type="text"
        id="linkSearch"
        placeholder="🔎 Search a website — e.g. aadhaar, result, train, pan…"
        data-i18n-ph="site.heroSearchPlaceholder"
        data-i18n-aria="ariaSearchLinks" aria-label="Search links"
      />
      <div className="linkgrid" id="linkGrid">
        {groups.map((group, index) => (
          <Fragment key={group.c[0]}>
            <div className="lcat" data-en={group.c[0]} data-hi={group.c[1]} data-cat="1">
              {group.c[0]}
            </div>
            {group.items.map((item) => (
              <a
                key={item[4]}
                className={index % 2 ? "site saf" : "site"}
                href={item[4]}
                target="_blank"
                rel="noopener"
                data-search={`${item[1]} ${item[2]} ${item[3]}`.toLowerCase()}
              >
                {(() => { const host = item[4].replace(/^https?:\/\//, "").split("/")[0]; const logo = LOGOS[host]; return logo ? <img className="lic" src={`/link-logos/${logo}`} alt="" loading="lazy" /> : <span className="ic">{item[0]}</span>; })()}
                <span>
                  <b>{item[1]}</b>
                  <small data-en={item[2]} data-hi={item[3]}>
                    {item[2]}
                  </small>
                </span>
              </a>
            ))}
          </Fragment>
        ))}
      </div>
      <p className="hint" id="linkNone" style={{ display: "none" }} data-i18n="linkNone">
        No site in the list matches that name.
      </p>
    </section>
  );
}

export function OwnerNotesSection() {
  return (
    <section>
      <div className="sec-head">
        <h2 data-i18n="ownerTitle">Setting this up on the cafe / school computer</h2>
      </div>
      <div className="owner">
        <div className="card">
          <h3 data-i18n="own1T">🏠 Make it the homepage</h3>
          <p data-i18n="own1D">
            Set this page as the browser homepage / startup page — every tool and link is in front
            of you the moment the shop opens. Chrome: Settings → On startup → Open a specific page.
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="own2T">⚡ How much load?</h3>
          <p data-i18n="own2D">
            This page is one light file and no photo is uploaded to any server, so server load is
            zero and hosting is free. It opens instantly on 3G / slow net and old Windows PCs; once
            open, the tools even work without net (the links need net).
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="own3T">🔒 Children’s photos stay safe</h3>
          <p data-i18n="own3D">
            All processing happens in the visitor’s own browser — a photo never goes to any server
            outside this computer. For a school this is the biggest plus point, and you can tell
            customers so with confidence.
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="own4T">🖨️ Remember the print setting</h3>
          <p data-i18n="own4D">
            Always print the passport sheet at Actual size / 100%. Check the glossy side on 4×6
            photo paper, and take one test print on plain paper first.
          </p>
        </div>
      </div>
    </section>
  );
}
