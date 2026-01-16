import jsPDF from "jspdf";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import "../App.css";

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

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso || "-";
  }
}

function riskTone(risk) {
  if (risk === "HIGH") return "warning";
  if (risk === "MEDIUM") return "neutral";
  return "success";
}

export default function Dashboard({ user }) {
  // Inputs
  const [product, setProduct] = useState("T-shirts");
  const [country, setCountry] = useState("UK");
  const [experience, setExperience] = useState("beginner");

  // Live check result
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // HS selection
  const [selectedHs, setSelectedHs] = useState(null);
  const [lockedHs, setLockedHs] = useState(null);

  // Saving current report
  const [savedReportId, setSavedReportId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Saved reports
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportLoading, setSelectedReportLoading] = useState(false);

  const canSubmit = product.trim().length > 0 && country.trim().length > 0;

  const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

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

  async function getTokenOrThrow() {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) throw new Error("Please sign in again.");
    return token;
  }

  const fetchReports = async (autoOpenFirst = true) => {
    if (!API_URL) {
      setReportsError("Missing API URL. Set VITE_API_URL in Vercel env vars.");
      return;
    }

    try {
      setReportsLoading(true);
      setReportsError("");

      const token = await getTokenOrThrow();

      const res = await fetch(`${API_URL}/api/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load reports");

      const list = data.reports || [];
      setReports(list);

      if (autoOpenFirst && list.length && !selectedReport) {
        openReport(list[0].id);
      }
    } catch (e) {
      setReportsError(e?.message || "Could not load reports");
    } finally {
      setReportsLoading(false);
    }
  };

  const openReport = async (id) => {
    if (!API_URL) return;

    try {
      setSelectedReportLoading(true);
      setReportsError("");

      const token = await getTokenOrThrow();

      const res = await fetch(`${API_URL}/api/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load report");

      setSelectedReport(data.report || null);
    } catch (e) {
      setReportsError(e?.message || "Could not load report");
    } finally {
      setSelectedReportLoading(false);
    }
  };

  const deleteReport = async (id) => {
    const ok = confirm("Delete this report? This cannot be undone.");
    if (!ok) return;

    if (!API_URL) return;

    try {
      const token = await getTokenOrThrow();

      const res = await fetch(`${API_URL}/api/reports/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete report");

      setReports((prev) => prev.filter((r) => r.id !== id));
      if (selectedReport?.id === id) setSelectedReport(null);

      alert("Deleted ✅");
    } catch (e) {
      alert(e?.message || "Could not delete");
    }
  };

  useEffect(() => {
    fetchReports(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkExport = async () => {
    if (!API_URL) {
      setError("Missing API URL. Set VITE_API_URL in Vercel env vars.");
      return;
    }
    if (!canSubmit) return;

    setLoading(true);
    setError("");
    setResult(null);
    setSelectedHs(null);
    setLockedHs(null);
    setSavedReportId(null);

    try {
      const res = await fetch(`${API_URL}/api/export-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, country, experience }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Backend error");

      // Always show something (no blank sections)
      const safe = {
        ...data,
        documents:
          data.documents && data.documents.length
            ? data.documents
            : ["Commercial Invoice", "Packing List", "Product Specification Sheet"],
        warnings: data.warnings || [],
        nextSteps:
          data.nextSteps && data.nextSteps.length
            ? data.nextSteps
            : ["Confirm HS code", "Check destination import rules", "Talk to a freight forwarder"],
        hs_code_suggestions: data.hs_code_suggestions || [],
      };

      setResult(safe);

      if (safe?.hs_code_suggestions?.length) {
        setSelectedHs(safe.hs_code_suggestions[0]);
      }
    } catch (err) {
      setError(err?.message || "Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDFfromReport = (r) => {
    if (!r) return;

    const doc = new jsPDF();
    let y = 15;

    const productV = r.product || "-";
    const countryV = r.country || "-";
    const experienceV = r.experience || "-";
    const risk = r.risk_level || "-";
    const incoterm = r.incoterm || "-";
    const hsCode = r.hs_code || "-";
    const hsDesc = r.hs_description || "-";

    const resultJson = r.result || {};
    const documents = resultJson.documents || [];
    const warnings = resultJson.warnings || [];
    const nextSteps = resultJson.nextSteps || [];

    doc.setFontSize(16);
    doc.text("Export Readiness Report", 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.text("Generated by Export AI Agent", 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Product: ${productV}`, 14, y); y += 6;
    doc.text(`Destination: ${countryV}`, 14, y); y += 6;
    doc.text(`Experience: ${experienceV}`, 14, y); y += 6;
    doc.text(`Risk Level: ${risk}`, 14, y); y += 6;
    doc.text(`Incoterm: ${incoterm}`, 14, y); y += 8;

    doc.setFontSize(13);
    doc.text("HS Code", 14, y); y += 6;
    doc.setFontSize(11);
    doc.text(`${hsCode} - ${hsDesc}`, 14, y);
    y += 8;

    doc.setFontSize(13);
    doc.text("Required Documents", 14, y); y += 6;
    doc.setFontSize(11);
    (documents.length ? documents : ["None"]).forEach((d) => {
      doc.text(`• ${d}`, 16, y);
      y += 5;
    });

    y += 4;
    doc.setFontSize(13);
    doc.text("Warnings", 14, y); y += 6;
    doc.setFontSize(11);
    (warnings.length ? warnings : ["None"]).forEach((w) => {
      doc.text(`• ${w}`, 16, y);
      y += 5;
    });

    y += 4;
    doc.setFontSize(13);
    doc.text("Next Steps", 14, y); y += 6;
    doc.setFontSize(11);
    (nextSteps.length ? nextSteps : ["None"]).forEach((n) => {
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

    doc.save(`export-report-${r.id || "saved"}.pdf`);
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
    doc.text(`Risk Level: ${result.risk_level || "-"}`, 14, y); y += 6;
    doc.text(`Incoterm: ${result.recommended_incoterm || "-"}`, 14, y); y += 8;

    doc.setFontSize(13);
    doc.text("HS Code", 14, y); y += 6;
    doc.setFontSize(11);
    doc.text(`${lockedHs.code} - ${lockedHs.description}`, 14, y);
    y += 8;

    doc.setFontSize(13);
    doc.text("Required Documents", 14, y); y += 6;
    doc.setFontSize(11);
    (result.documents || []).forEach((d) => {
      doc.text(`• ${d}`, 16, y);
      y += 5;
    });

    y += 4;
    doc.setFontSize(13);
    doc.text("Warnings", 14, y); y += 6;
    doc.setFontSize(11);
    ((result.warnings && result.warnings.length ? result.warnings : ["None"]) || []).forEach((w) => {
      doc.text(`• ${w}`, 16, y);
      y += 5;
    });

    y += 4;
    doc.setFontSize(13);
    doc.text("Next Steps", 14, y); y += 6;
    doc.setFontSize(11);
    (result.nextSteps || []).forEach((n) => {
      doc.text(`• ${n}`, 16, y);
      y += 5;
    });

    doc.save("export-readiness-report.pdf");
  };

  const saveReport = async () => {
    if (!API_URL) {
      alert("Missing API URL. Set VITE_API_URL in Vercel env vars.");
      return;
    }
    if (!result || !lockedHs) {
      alert("Please run a check and lock an HS code first.");
      return;
    }

    try {
      setSaving(true);
      const token = await getTokenOrThrow();

      const res = await fetch(`${API_URL}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product, country, experience, result, lockedHs }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save");

      setSavedReportId(data.reportId);
      alert(`Saved ✅ Report ID: ${data.reportId}`);

      await fetchReports(false);
      await openReport(data.reportId);
    } catch (e) {
      alert(e?.message || "Could not save report");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

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

        <div className="topbar__actions">
          <Badge tone="neutral">UK-first</Badge>
          <Badge tone={API_URL ? "success" : "warning"}>
            {API_URL ? "Backend Connected" : "Missing API URL"}
          </Badge>
          <Badge tone="neutral">{user?.email || "Auth OK"}</Badge>

          <button className="btn secondary" onClick={() => fetchReports(true)} disabled={reportsLoading}>
            {reportsLoading ? "Refreshing…" : "Refresh Reports"}
          </button>

          <button className="btn secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar__title">Export Journey</div>

          <div className="steps">
            {journeySteps.map((s, idx) => {
              const state = idx < currentStepIndex ? "done" : idx === currentStepIndex ? "active" : "todo";
              return (
                <div key={s.key} className={`step step--${state}`}>
                  <div className="step__icon">{state === "done" ? "✓" : idx + 1}</div>
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

          <div style={{ marginTop: 16 }}>
            <div className="sidebar__title">Saved Reports</div>

            {reportsError ? <div className="alert alert--error">{reportsError}</div> : null}

            {reportsLoading ? (
              <div className="muted">Loading…</div>
            ) : reports.length ? (
              <div className="muted" style={{ marginBottom: 8 }}>
                Click any report to view details
              </div>
            ) : (
              <div className="muted">No saved reports yet.</div>
            )}

            {reports.map((r) => (
              <div
                key={r.id}
                className="hsRow"
                style={{
                  cursor: "pointer",
                  marginTop: 8,
                  border: selectedReport?.id === r.id ? "1px solid rgba(255,255,255,0.35)" : undefined,
                }}
                onClick={() => openReport(r.id)}
              >
                <div className="hsText">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <b>{r.product}</b> → {r.country} <span className="muted">(HS: {r.hs_code || "-"})</span>
                    </div>
                    <Badge tone={riskTone(r.risk_level)}>{r.risk_level || "-"}</Badge>
                  </div>

                  <div className="muted">{formatDate(r.created_at)}</div>

                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    <button
                      className="btn secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        openReport(r.id);
                      }}
                    >
                      View
                    </button>

                    <button
                      className="btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadPDFfromReport(selectedReport?.id === r.id ? selectedReport : r);
                      }}
                    >
                      PDF
                    </button>

                    <button
                      className="btn secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteReport(r.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="main">
          <Card
            title="Report Details"
            subtitle="Saved report view (clean + downloadable)"
            right={selectedReportLoading ? <Badge tone="neutral">Loading…</Badge> : <Badge tone="neutral">v1</Badge>}
          >
            {!selectedReport ? (
              <div className="muted">Select a report from the left to view it here.</div>
            ) : (
              <div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <Badge tone="neutral">Product: {selectedReport.product}</Badge>
                  <Badge tone="neutral">Dest: {selectedReport.country}</Badge>
                  <Badge tone="neutral">HS: {selectedReport.hs_code}</Badge>
                  <Badge tone="neutral">Incoterm: {selectedReport.incoterm}</Badge>
                  <Badge tone={riskTone(selectedReport.risk_level)}>Risk: {selectedReport.risk_level}</Badge>
                </div>

                <div className="muted" style={{ marginTop: 10 }}>
                  Created: {formatDate(selectedReport.created_at)}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                  <button className="btn" onClick={() => downloadPDFfromReport(selectedReport)}>
                    Download PDF (Saved)
                  </button>
                  <button className="btn secondary" onClick={() => deleteReport(selectedReport.id)}>
                    Delete Report
                  </button>
                </div>

                <div style={{ marginTop: 14 }}>
                  <Card title="Required Documents">
                    <List items={selectedReport.result?.documents || []} empty="None" />
                  </Card>

                  <Card title="Warnings">
                    <List items={selectedReport.result?.warnings || []} empty="None" />
                  </Card>

                  <Card title="Next Steps">
                    <List items={selectedReport.result?.nextSteps || []} empty="None" />
                  </Card>
                </div>

                {import.meta.env.DEV ? (
                  <details style={{ marginTop: 14 }}>
                    <summary className="muted" style={{ cursor: "pointer" }}>
                      Full report JSON (debug)
                    </summary>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(selectedReport, null, 2)}</pre>
                  </details>
                ) : null}
              </div>
            )}
          </Card>

          <Card
            title="Start an export readiness check"
            subtitle="Enter the basics — the engine will return required documents, warnings, and next steps."
            right={loading ? <Badge tone="neutral">Analysing…</Badge> : <Badge tone="neutral">v1</Badge>}
          >
            <div className="grid">
              <div className="field">
                <label className="label">Product</label>
                <input className="input" value={product} onChange={(e) => setProduct(e.target.value)} />
              </div>

              <div className="field">
                <label className="label">Destination Country</label>
                <input className="input" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>

              <div className="field">
                <label className="label">Experience</label>
                <select className="input" value={experience} onChange={(e) => setExperience(e.target.value)}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="actions">
                <button className="btn" onClick={checkExport} disabled={!canSubmit || loading}>
                  {loading ? "Checking…" : "Check Export Readiness"}
                </button>
                {!API_URL ? <div className="muted">Fix: Set VITE_API_URL in Vercel.</div> : null}
              </div>
            </div>

            {result ? (
              <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                <Badge tone={riskTone(result.risk_level)}>Risk: {result.risk_level}</Badge>
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

                <div className="muted" style={{ marginTop: "10px" }}>
                  {result.hs_note || "HS code suggestions are guidance only."}
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                  <button className="btn secondary" disabled={!selectedHs || !!lockedHs} onClick={() => setLockedHs(selectedHs)}>
                    Confirm HS Code
                  </button>

                  <button className="btn" disabled={!lockedHs} onClick={downloadPDF}>
                    Download Export Report (PDF)
                  </button>

                  <button className="btn secondary" disabled={!lockedHs || saving} onClick={saveReport}>
                    {saving ? "Saving..." : "Save Report"}
                  </button>

                  <button
                    className="btn secondary"
                    disabled={!lockedHs}
                    onClick={() => {
                      setLockedHs(null);
                      setSavedReportId(null);
                    }}
                  >
                    Unlock
                  </button>
                </div>

                <div className="muted" style={{ marginTop: 8 }}>
                  {lockedHs
                    ? `Final HS code locked: ${lockedHs.code}`
                    : selectedHs
                    ? `Selected: ${selectedHs.code} (click Confirm to lock)`
                    : "Tip: click a suggestion to select it"}
                </div>

                {savedReportId ? (
                  <div className="muted" style={{ marginTop: "8px" }}>
                    Saved Report ID: <b>{savedReportId}</b>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="muted">
                {result?.hs_note || "No HS suggestion yet. Add more detail like material/processing/use."}
              </div>
            )}
          </Card>

          <div className="results">
            <Card title="Required Documents" subtitle="What you’ll typically need to prepare" right={result ? <Badge tone="success">Ready</Badge> : <Badge tone="neutral">Waiting</Badge>}>
              <List items={result?.documents} empty="Run a check to generate your checklist." />
            </Card>

            <Card
              title="Warnings"
              subtitle="Things that commonly cause delays or mistakes"
              right={result?.warnings?.length ? <Badge tone="warning">{result.warnings.length} alerts</Badge> : <Badge tone="neutral">None</Badge>}
            >
              <List items={result?.warnings} empty="No warnings yet." />
            </Card>

            <Card title="Next Steps" subtitle="Your recommended actions from here" right={result ? <Badge tone="neutral">Action plan</Badge> : null}>
              <List items={result?.nextSteps} empty="Run a check to see next steps." />
            </Card>
          </div>

          <div className="footerNote">This is your v1. Next we’ll add country-specific rules and document templates.</div>
        </main>
      </div>
    </div>
  );
}
