export function LoginSection() {
  return (
    <section id="login">
      <div className="sec-head">
        <span className="no">🔐</span>
        <h2 data-i18n="authTitle">Sign in — a small profile on this device</h2>
      </div>
      <p className="sec-sub" data-i18n="authDesc">
        One small profile, saved only in this browser on this device. No password, and nothing is sent to any server. Every tool stays free and open to everyone — signed in or not. Pick School or Cyber Cafe — it is only a label on your profile.
      </p>
      <div className="card">
        <form id="authForm" noValidate>
          <div className="authgrid">
            <div className="field">
              <label className="fl" htmlFor="authName" data-i18n="authNameL">
                Your name
              </label>
              <input type="text" id="authName" autoComplete="name" />
            </div>
            <div className="field">
              <label className="fl" htmlFor="authContact" data-i18n="authContactL">
                Mobile number or email
              </label>
              <input type="text" id="authContact" autoComplete="tel" />
            </div>
          </div>
          <div className="field">
            <label className="fl" data-i18n="authKindL">
              I am signing in as
            </label>
            <div className="chips" id="authKind">
              <button type="button" className="chip" data-v="school" aria-pressed="true" data-i18n="authKindSchool">
                🏫 School
              </button>
              <button type="button" className="chip saf" data-v="cafe" aria-pressed="false" data-i18n="authKindCafe">
                🖨️ Cyber Cafe
              </button>
            </div>
          </div>
          <div className="btnrow">
            <button className="btn" type="submit" id="authSave" data-i18n="authSave">Save & sign in</button>
          </div>
          <div className="msg" id="authMsg" />
        </form>
        <div id="authProfile" hidden>
          <p style={{ margin: "0 0 4px", fontSize: 17 }}>
            <span data-i18n="authHello">Signed in as</span> <b id="authWho" />
          </p>
          <p style={{ margin: 0, color: "var(--ink2)" }} id="authMeta" />
          <div className="btnrow">
            <button className="btn ghost small" id="authEdit" data-i18n="authEdit">
              Edit profile
            </button>
            <button className="btn ghost small" id="authOut" data-i18n="authOut">
              Sign out
            </button>
          </div>
        </div>
        <p className="hint" data-i18n="authNote">
          Honest note: this sign-in lives on this device only, so it will not appear on another
          phone or computer. Accounts that follow you everywhere arrive with the educafehub.com
          domain phase. Signing out removes the profile from this device.
        </p>
      </div>
    </section>
  );
}
