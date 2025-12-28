import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import "./App.css";
import { supabase } from "./supabaseClient";

function Badge({ tone = "neutral", children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

function Card({ title, subtitle, children, right }) {
  return (
    <div className="card">
      <div className="card__head">
        <div>
          <div className="card__title">{title}</div>
          {subtitle ? <div className="card__subtitle">{subtitle}</div> : null}
        </div>
        {right ? <div className="card__right">{right}</div> : null}
      </div>
      <div className="card__body">{children}</div>
    </div>
  );
}

function List({ items, empty = "None" }) {
  if (!items || items.length === 0) return <div className="muted">{empty}</div>;
  return (
    <ul className="list">
      {items.map((x, i) => (
        <li key={i} className="list__item">
          <span className="dot" />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const signInWithGoogle = async () => {
    setMsg("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setMsg(error.message);
    setLoading(false);
  };

  const submitEmail = async () => {
    setMsg("");
    setLoading(true);

    if (!email || !password) {
      setMsg("Please enter email and password.");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMsg(error.message);
      else setMsg("Account created. You can sign in now.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setMsg(error.message);
    else onAuthed?.(data.session);

    setLoading(false);
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand__logo">EA</div>
          <div className="brand__text">
            <div className="brand__name">Export AI Agent</div>
            <div className="brand__tag">Secure exporter readiness platform</div>
          </div>
        </div>
        <div className="topbar__actions">
          <Badge tone="neutral">UK-first</Badge>
          <Badge tone="neutral">Auth</Badge>
        </div>
      </header>

      <div className="layout">
        <main className="main" style={{ maxWidth: 560, margin: "0 auto" }}>
          <Card
            title={mode === "signup" ? "Create your account" : "Sign in"}
            subtitle="Use email/password or Google. Your export journeys will be saved securely."
            right={<Badge tone="neutral">v1</Badge>}
          >
            <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="field">
                <label className="label">Email</label>
                <input
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                />
              </div>

              <div className="field">
                <label className="label">Password</label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn" onClick={submitEmail} disabled={loading}>
                  {loading ? "Please wait…" : mode === "signup" ? "Sign up" : "Sign in"}
                </button>

                <button className="btn secondary" onClick={signInWithGoogle} disabled={loading}>
                  Continue with Google
                </button>

                <button
                  className="btn secondary"
                  onClick={() => {
                    setMsg("");
                    setMode(mode === "signup" ? "signin" : "signup");
                  }}
                  disabled={loading}
                >
                  {mode === "signup" ? "Have an account? Sign in" : "New here? Create account"}
                </button>
              </div>

              {msg ? <div className="alert alert--error">{msg}</div> : null}

              <div className="muted" style={{ marginTop: 10 }}>
                Tip: For now, email verification is off to keep testing fast. We’ll enable it before launch.
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const API_BASE = import.meta.env.VITE_API_URL;

  const [session, setSession] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  // Your existing app state
  const [product, setProduct] = useState("T-shirts");
  const [country, setCountry] = useState("UK");
  const [experience, setExperience] = useState("beginner");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [lockedHs, setLockedHs] = useState(null);
  const [selectedHs, setSelectedHs] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setUserEmail(data.session?.user?.email || "");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession || null);
      setUserEmail(newSession?.user?.email || "");
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setResult(null);
    setError("");
  };

  const canSubmit = product.trim().length > 0 && country.trim().length > 0;

  const journeySteps = useMemo(
    () => [
      { key: "INPUT", label: "Input details" },
      { key: "READINESS", label: "Readiness check" },
      { key: "DOCS", label: "Documents" },
      { key: "NEXT", label: "Next actions" },
    ],
    []
  );

  const currentStepIndex = useMemo(() => {
    if (!result) return 0;
    if (result?.documents?.length) return 2;
    return 1;
  }, [result]);

  // helper: get access token to send to backend
  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || "";
  };

  const checkExport = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setError("");
    setResult(null);
    setLockedHs(null);
    setSelectedHs(null);

    try {
      const token = await getToken();

      const res = await fetch(`${API_BASE}/api/export-check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product, country, experience }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Backend error");

      setResult(data);

      if (data?.hs_code_suggestions?.length) {
        setSelectedHs(data.hs_code_suggestions[0]);
      }
    } catch (err) {
      setError(err?.message || "Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!result || !lockedHs) {
      alert("Please run a check and lock an HS code first.");
      return;
    }

    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(16);
    doc.text("Export Readiness Report", 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.text("Generated by Export AI Agent", 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Product: ${product}`, 14, y); y += 6;
    doc.text(`Destination: ${country}`, 14, y); y += 6;
    doc.text(`Experience: ${experience}`, 14, y); y += 6;
    doc.text(`Risk Level: ${result.risk_level}`, 14, y); y += 6;
    doc.text(`Incoterm: ${result.recommended_incoterm}`, 14, y); y += 8;

    doc.setFontSize(13);
    doc.text("HS Code", 14, y); y += 6;
    doc.setFontSize(11);
    doc.text(`${lockedHs.code} - ${lockedHs.description}`, 14, y);
    y += 8;

    doc.setFontSize(13);
    doc.text("Required Documents", 14, y); y += 6;
    doc.setFontSize(11);
    result.documents.forEach(d => {
      doc.text(`• ${d}`, 16, y);
      y += 5;
    });

    y += 4;
    doc.setFontSize(13);
    doc.text("Warnings", 14, y); y += 6;
    doc.setFontSize(11);
    (result.warnings?.length ? result.warnings : ["None"]).forEach(w => {
      doc.text(`• ${w}`, 16, y);
      y += 5;
    });

    y += 4;
    doc.setFontSize(13);
    doc.text("Next Steps", 14, y); y += 6;
    doc.setFontSize(11);
    result.nextSteps.forEach(n => {
      doc.text(`• ${n}`, 16, y);
      y += 5;
    });

    y += 8;
    doc.setFontSize(9);
    doc.text(
      "Disclaimer: This report provides guidance only. Final compliance decisions must be confirmed with customs authorities or licensed professionals.",
      14,
      y,
      { maxWidth: 180 }
    );

    doc.save("export-readiness-report.pdf");
  };

  // If not logged in → show auth screen
  if (!session) {
    return <AuthScreen onAuthed={(s) => setSession(s)} />;
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand__logo">EA</div>
          <div className="brand__text">
            <div className="brand__name">Export AI Agent</div>
            <div className="brand__tag">Export readiness & compliance guidance</div>
          </div>
        </div>

        <div className="topbar__actions" style={{ gap: 10 }}>
          <Badge tone="neutral">{userEmail || "Signed in"}</Badge>
          <Badge tone="success">Auth OK</Badge>
          <button className="btn secondary" onClick={signOut}>Logout</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar__title">Export Journey</div>

          <div className="steps">
            {journeySteps.map((s, idx) => {
              const state =
                idx < currentStepIndex
                  ? "done"
                  : idx === currentStepIndex
                  ? "active"
                  : "todo";
              return (
                <div key={s.key} className={`step step--${state}`}>
                  <div className="step__icon">
                    {state === "done" ? "✓" : idx + 1}
                  </div>
                  <div className="step__label">{s.label}</div>
                </div>
              );
            })}
          </div>

          <div className="sidebar__help">
            <div className="sidebar__helpTitle">Tip</div>
            <div className="sidebar__helpText">
              Start simple: product + destination + experience. We’ll generate a clear checklist and next actions.
            </div>
          </div>
        </aside>

        <main className="main">
          <Card
            title="Start an export readiness check"
            subtitle="Enter the basics — the engine will return required documents, warnings, and next steps."
            right={loading ? <Badge tone="neutral">Analysing…</Badge> : <Badge tone="neutral">v1</Badge>}
          >
            <div className="grid">
              <div className="field">
                <label className="label">Product</label>
                <input
                  className="input"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g., T-shirts, spices, machine parts"
                />
              </div>

              <div className="field">
                <label className="label">Destination Country</label>
                <input
                  className="input"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g., Germany, UAE, India"
                />
              </div>

              <div className="field">
                <label className="label">Experience</label>
                <select
                  className="input"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="actions">
                <button className="btn" onClick={checkExport} disabled={!canSubmit || loading}>
                  {loading ? "Checking…" : "Check Export Readiness"}
                </button>

                {!canSubmit ? <div className="muted">Please enter product and destination.</div> : null}
              </div>
            </div>

            {result ? (
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <Badge
                  tone={
                    result.risk_level === "HIGH"
                      ? "warning"
                      : result.risk_level === "MEDIUM"
                      ? "neutral"
                      : "success"
                  }
                >
                  Risk: {result.risk_level}
                </Badge>
                <Badge tone="neutral">Incoterm: {result.recommended_incoterm}</Badge>
                <Badge tone="neutral">Stage: {result.journey_stage}</Badge>
              </div>
            ) : null}

            {error ? <div className="alert alert--error">{error}</div> : null}
          </Card>

          <Card
            title="HS Code Suggestions"
            subtitle="Initial classification guidance (confirm before shipping)"
            right={
              result?.hs_code_suggestions?.length ? (
                <Badge tone="success">{result.hs_code_suggestions.length} suggestion(s)</Badge>
              ) : (
                <Badge tone="neutral">None</Badge>
              )
            }
          >
            {result?.hs_code_suggestions?.length ? (
              <div className="hsList">
                {result.hs_code_suggestions.map((s, i) => {
                  const isSelected = selectedHs?.code === s.code;
                  const isLocked = lockedHs?.code === s.code;

                  return (
                    <div
                      key={i}
                      className={`hsRow ${isSelected ? "hsRow--selected" : ""} ${isLocked ? "hsRow--locked" : ""}`}
                      onClick={() => setSelectedHs(s)}
                      style={{ cursor: "pointer" }}
                      title="Click to select"
                    >
                      <div className="hsCode">{s.code}</div>
                      <div className="hsText">
                        <div className="hsDesc">{s.description}</div>
                        <div className="muted">Confidence: {s.confidence}</div>
                        {isLocked ? <div className="hsLockedText">✅ Locked as final HS code</div> : null}
                      </div>
                    </div>
                  );
                })}

                <div className="muted" style={{ marginTop: 10 }}>{result.hs_note}</div>

                <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                  <button className="btn secondary" disabled={!selectedHs || !!lockedHs} onClick={() => setLockedHs(selectedHs)}>
                    Confirm HS Code
                  </button>

                  <button className="btn" disabled={!lockedHs} onClick={downloadPDF}>
                    Download Export Report (PDF)
                  </button>

                  <button className="btn secondary" disabled={!lockedHs} onClick={() => setLockedHs(null)}>
                    Unlock
                  </button>

                  <div className="muted">
                    {lockedHs
                      ? `Final HS code locked: ${lockedHs.code}`
                      : selectedHs
                      ? `Selected: ${selectedHs.code} (click Confirm to lock)`
                      : "Tip: click a suggestion to select it"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="muted">{result?.hs_note || "Run a check to get HS code guidance."}</div>
            )}
          </Card>

          <div className="results">
            <Card
              title="Required Documents"
              subtitle="What you’ll typically need to prepare"
              right={result ? <Badge tone="success">Ready</Badge> : <Badge tone="neutral">Waiting</Badge>}
            >
              <List items={result?.documents} empty="Run a check to generate your checklist." />
            </Card>

            <Card
              title="Warnings"
              subtitle="Things that commonly cause delays or mistakes"
              right={
                result?.warnings?.length ? (
                  <Badge tone="warning">{result.warnings.length} alerts</Badge>
                ) : (
                  <Badge tone="neutral">None</Badge>
                )
              }
            >
              <List items={result?.warnings} empty="No warnings yet." />
            </Card>

            <Card
              title="Next Steps"
              subtitle="Your recommended actions from here"
              right={result ? <Badge tone="neutral">Action plan</Badge> : null}
            >
              <List items={result?.nextSteps} empty="Run a check to see next steps." />
            </Card>
          </div>

          <div className="footerNote">
            This is your v1. Next we’ll add saved journeys, subscriptions, and deeper country logic.
          </div>
        </main>
      </div>
    </div>
  );
}
