// src/pages/Dashboard.jsx
import jsPDF from "jspdf";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import "../App.css";
import LandedCostCalculator from "../components/LandedCostCalculator.jsx";
import FreightEstimator from "../components/FreightEstimator";
import BuyerFinder from "../components/BuyerFinder";
import MarketAnalyzer from "../components/MarketAnalyzer";
import AIAdvisor from "../components/AIAdvisor";
import ProfitSimulator from "../components/ProfitSimulator";
import ImporterFinder from "../components/ImporterFinder";
import TariffLookup from "../components/TariffLookup";
import BuyerDiscovery from "../components/BuyerDiscovery";
import MarketOpportunity from "../components/MarketOpportunity";
import PublicReport from "./PublicReport";
import PricingTools from "../components/dashboard/PricingTools";
import MarketIntelligence from "../components/dashboard/MarketIntelligence.jsx";
import AITools from "../components/dashboard/AITools";
import ExportReadiness from "../components/dashboard/ExportReadiness.jsx";
import ReportDetails from "../components/dashboard/ReportDetails.jsx";

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

const DOC_DETAILS = {
  "Commercial Invoice": {
    why: "Customs uses this to assess value, duties, and verify buyer/seller details.",
    include: [
      "Seller & buyer details",
      "Invoice number/date",
      "HS code",
      "Incoterm",
      "Currency",
      "Unit price & total",
      "Country of origin",
    ],
  },
  "Packing List": {
    why: "Helps customs and carriers verify shipment contents and weights.",
    include: ["Carton count", "Gross/net weight", "Dimensions", "Marks/labels", "Item breakdown per carton"],
  },
  "Certificate of Origin": {
    why: "Proves where goods were produced—used for duty treatment and compliance.",
    include: ["Exporter details", "Consignee", "Origin statement", "Signature/stamp (if required)"],
  },
  "EORI Number": {
    why: "Required for customs clearance in the UK/EU. Usually needed by importer and sometimes exporter.",
    include: ["Importer EORI", "Broker/forwarder details"],
  },
  "Ingredients / Product Specification Sheet": {
    why: "For food exports, helps with labeling, ingredient compliance, allergens, and buyer due diligence.",
    include: ["Ingredients", "Allergen statement", "Processing method", "Shelf life", "Packaging type", "Storage conditions"],
  },
  "Product Specification Sheet (materials, composition, use)": {
    why: "When HS code is unclear, this is needed for accurate classification and compliance.",
    include: ["Composition/material", "Use/purpose", "Manufacturing process", "Photos", "Packaging details"],
  },
  "Technical Datasheet / Manual": {
    why: "For machinery parts, helps customs classification and buyer due diligence.",
    include: ["Part number", "Material", "Use/function", "Drawings/photos", "Compatibility"],
  },
  "Safety Data Sheet (SDS/MSDS)": {
    why: "For chemicals, required for safety, transport, and import compliance.",
    include: ["Hazard classification", "Ingredients", "Handling/storage", "Transport info", "Emergency details"],
  },
  "Fabric Composition Certificate (if available)": {
    why: "Helps confirm fiber content (cotton vs blends) for correct HS classification.",
    include: ["Fiber breakdown %", "Test report (if available)", "Supplier/manufacturer details"],
  },
  "Label Artwork / Label Text (if available)": {
    why: "Helps validate labeling requirements for destination market.",
    include: ["Ingredients", "Allergens", "Net weight", "Best before/expiry", "Importer details (as required)"],
  },
};

function riskTone(risk) {
  if (risk === "HIGH") return "warning";
  if (risk === "MEDIUM") return "neutral";
  return "success";
}

function getHsExplanation(explanations, code) {
  if (!Array.isArray(explanations)) return "";
  const hit = explanations.find((x) => x?.code === code);
  return hit?.why || "";
}

function getDocReason(docReasons, docName) {
  if (!Array.isArray(docReasons)) return "";
  const hit = docReasons.find((x) => x?.doc === docName);
  return hit?.reason || "";
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
  const [activeSection, setActiveSection] = useState("readiness");

  // Payment gate (MVP)
  const [isPaid, setIsPaid] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  // ✅ SAFE objects (prevents null crashes)
  const reportResult = selectedReport?.result || {};
  const liveResult = result || {};
  const complianceScore = useMemo(() => {
  if (!result) return null;

  const hsScore = lockedHs ? 90 : selectedHs ? 75 : 40;

  const docsScore = (liveResult.documents?.length || 0) >= 3 ? 85 : 60;

  const riskScore =
    liveResult.risk_level === "LOW"
      ? 90
      : liveResult.risk_level === "MEDIUM"
      ? 70
      : 50;

  const experienceScore =
    experience === "expert"
      ? 90
      : experience === "intermediate"
      ? 75
      : 60;

  const total =
    (hsScore + docsScore + riskScore + experienceScore) / 4;

  return {
    total: Math.round(total),
    hsScore,
    docsScore,
    riskScore,
    experienceScore,
  };
}, [result, lockedHs, selectedHs, experience]);

  const canSubmit = product.trim().length > 0 && country.trim().length > 0;

  const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const STRIPE_LINK = "https://buy.stripe.com/28E5kF6KSfXra8695BbEA00";

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

  async function loadPaidStatus() {
    const { data: sessionData } = await supabase.auth.getSession();
    const u = sessionData?.session?.user;
    if (!u?.email) return;

    try {
      // Get paid status by email
      const { data: existing, error: selErr } = await supabase
        .from("user_profiles")
        .select("is_paid")
        .eq("email", u.email)
        .single();

      // If row not found → create it
      if (selErr && selErr.code === "PGRST116") {
        const { error: insErr } = await supabase.from("user_profiles").insert({
          id: u.id,
          email: u.email,
          is_paid: false,
        });

        if (insErr) console.log("profile insert error", insErr);
        setIsPaid(false);
        return;
      }

      if (selErr) {
        console.log("profile select error", selErr);
        setIsPaid(false);
        return;
      }

      setIsPaid(!!existing?.is_paid);
    } catch (e) {
      console.log("loadPaidStatus error", e);
      setIsPaid(false);
    }
  }

  useEffect(() => {
    fetchReports(true);
    loadPaidStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function requirePaid() {
    if (isPaid) return true;
    setPayOpen(true);
    return false;
  }

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
      const safe = {
        ...data,
        country_pack: data.country_pack || null,
        documents:
          data.documents && data.documents.length
            ? data.documents
            : ["Commercial Invoice", "Packing List", "Product Specification Sheet (materials, composition, use)"],
        warnings: data.warnings || [],
        nextSteps:
          data.nextSteps && data.nextSteps.length
            ? data.nextSteps
            : ["Confirm HS code", "Check destination import rules", "Talk to a freight forwarder"],
        hs_code_suggestions: data.hs_code_suggestions || [],
        hs_explanations: data.hs_explanations || [],
        document_reasons: data.document_reasons || [],
        compliance_checklist: data.compliance_checklist || [],
        country_rules: data.country_rules || [],
        official_links: data.official_links || [],
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

  // ------------------ Templates (PDF) ------------------
  const downloadInvoiceTemplate = () => {
    const doc = new jsPDF();
    let y = 14;

    doc.setFontSize(16);
    doc.text("Commercial Invoice (Template)", 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.text("Exporter: ________________________________", 14, y); y += 6;
    doc.text("Exporter Address: ________________________", 14, y); y += 6;
    doc.text("Buyer/Importer: __________________________", 14, y); y += 6;
    doc.text("Buyer Address: ___________________________", 14, y); y += 6;
    doc.text("Invoice No: __________   Date: ___________", 14, y); y += 6;
    doc.text(`Destination Country: ${country || "________"}`, 14, y); y += 6;
    doc.text("Incoterm: ____________", 14, y); y += 8;

    doc.setFontSize(12);
    doc.text("Goods Description", 14, y); y += 6;

    doc.setFontSize(10);
    doc.text("Item: ____________________", 14, y);
    doc.text("Qty: ______", 100, y);
    y += 6;

    doc.text("HS Code: ________________", 14, y);
    doc.text("Unit Price: ________", 100, y);
    y += 6;

    doc.text("Country of Origin: _______________________", 14, y);
    y += 8;

    doc.setFontSize(12);
    doc.text("Totals", 14, y); y += 6;
    doc.setFontSize(10);
    doc.text("Subtotal: ____________", 14, y); y += 6;
    doc.text("Freight/Insurance: ____________", 14, y); y += 6;
    doc.text("Total Invoice Value: ____________", 14, y); y += 10;

    doc.text("Declaration:", 14, y); y += 6;
    doc.text("I declare that the information on this invoice is true and correct.", 14, y); y += 8;

    doc.text("Name: __________________  Signature: ________________", 14, y); y += 6;
    doc.text("Company Stamp (if applicable): _______________________", 14, y);

    doc.save("commercial-invoice-template.pdf");
  };

  const downloadPackingListTemplate = () => {
    const doc = new jsPDF();
    let y = 14;

    doc.setFontSize(16);
    doc.text("Packing List (Template)", 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.text("Exporter: ________________________________", 14, y); y += 6;
    doc.text("Buyer/Importer: __________________________", 14, y); y += 6;
    doc.text("Shipment Ref / Invoice No: _______________", 14, y); y += 6;
    doc.text(`Destination Country: ${country || "________"}`, 14, y); y += 8;

    doc.setFontSize(12);
    doc.text("Carton Details", 14, y); y += 6;
    doc.setFontSize(10);

    doc.text("Carton No: ____   Marks: ________________", 14, y); y += 6;
    doc.text("Items inside: ____________________________", 14, y); y += 6;
    doc.text("Qty: ____   Net Wt: ____kg   Gross Wt: ____kg", 14, y); y += 6;
    doc.text("Dimensions (LxWxH): ______________________", 14, y); y += 10;

    doc.text("(Copy/paste this block for each carton)", 14, y); y += 10;

    doc.setFontSize(12);
    doc.text("Summary", 14, y); y += 6;
    doc.setFontSize(10);
    doc.text("Total Cartons: ____", 14, y); y += 6;
    doc.text("Total Net Weight: ____kg", 14, y); y += 6;
    doc.text("Total Gross Weight: ____kg", 14, y);

    doc.save("packing-list-template.pdf");
  };

  const downloadProductSpecTemplate = () => {
    const doc = new jsPDF();
    let y = 14;

    doc.setFontSize(16);
    doc.text("Product Specification Sheet (Template)", 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.text(`Product Name: ${product || "________"}`, 14, y); y += 6;
    doc.text("Brand (if any): __________________________", 14, y); y += 6;
    doc.text("Product Type/Category: ___________________", 14, y); y += 6;

    doc.text("Composition / Ingredients: ________________", 14, y); y += 6;
    doc.text("Allergens (food): _________________________", 14, y); y += 6;
    doc.text("Processing method: ________________________", 14, y); y += 6;

    doc.text("Packaging type: ___________________________", 14, y); y += 6;
    doc.text("Net weight per unit: ______________________", 14, y); y += 6;
    doc.text("Shelf life / Expiry: ______________________", 14, y); y += 6;
    doc.text("Storage conditions: _______________________", 14, y); y += 6;

    doc.text("Use / Purpose: ____________________________", 14, y); y += 6;
    doc.text("Country of Origin: ________________________", 14, y); y += 10;

    doc.setFontSize(9);
    doc.text(
      "Tip: This sheet helps customs classification (HS code) and compliance checks. Attach ingredients, labels, and photos when possible.",
      14,
      y,
      { maxWidth: 180 }
    );

    doc.save("product-spec-sheet-template.pdf");
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
 
    doc.setFontSize(13);
doc.text("Estimated Landed Cost", 14, y);
y += 6;

doc.setFontSize(11);
doc.text("Product Cost + Freight + Insurance calculated via Export AI Agent.", 14, y);
y += 6;

doc.text("Use the Landed Cost Calculator in the dashboard for pricing strategy.", 14, y);
y += 10;

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
    doc.text(`Risk Level: ${liveResult.risk_level || "-"}`, 14, y); y += 6;
    doc.text(`Incoterm: ${liveResult.recommended_incoterm || "-"}`, 14, y); y += 8;

    doc.setFontSize(11);
doc.text(
  "Risk Explanation: " + (liveResult.risk_reason || "General compliance risk evaluation."),
  14,
  y
);
y += 8;

    doc.setFontSize(13);
    doc.text("HS Code", 14, y); y += 6;
    doc.setFontSize(11);
    doc.text(`${lockedHs.code} - ${lockedHs.description}`, 14, y);
    y += 8;

    doc.setFontSize(13);
    doc.text("Required Documents", 14, y); y += 6;
    doc.setFontSize(11);
    (liveResult.documents || []).forEach((d) => {
      doc.text(`• ${d}`, 16, y);
      y += 5;
    });

    y += 4;
    doc.setFontSize(13);
    doc.text("Warnings", 14, y); y += 6;
    doc.setFontSize(11);
    ((liveResult.warnings && liveResult.warnings.length ? liveResult.warnings : ["None"]) || []).forEach((w) => {
      doc.text(`• ${w}`, 16, y);
      y += 5;
    });

    y += 4;
    doc.setFontSize(13);
    doc.text("Next Steps", 14, y); y += 6;
    doc.setFontSize(11);
    (liveResult.nextSteps || []).forEach((n) => {
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

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Badge tone="neutral">UK-first</Badge>
          <Badge tone={API_URL ? "success" : "warning"}>{API_URL ? "Backend Connected" : "Missing API URL"}</Badge>
          <Badge tone="neutral">{user?.email || "-"}</Badge>

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

          <div className="sidebar__title">Platform</div>

<div className="steps">

<div
  className={`step ${activeSection === "readiness" ? "step--active" : ""}`}
  onClick={() => setActiveSection("readiness")}
>
  <div className="step__icon">📦</div>
  <div className="step__label">Export Readiness</div>
</div>

<div
  className={`step ${activeSection === "pricing" ? "step--active" : ""}`}
  onClick={() => setActiveSection("pricing")}
>
  <div className="step__icon">💰</div>
  <div className="step__label">Pricing Tools</div>
</div>

<div
  className={`step ${activeSection === "market" ? "step--active" : ""}`}
  onClick={() => setActiveSection("market")}
>
  <div className="step__icon">🌍</div>
  <div className="step__label">Market Intelligence</div>
</div>

<div
  className={`step ${activeSection === "ai" ? "step--active" : ""}`}
  onClick={() => setActiveSection("ai")}
>
  <div className="step__icon">🤖</div>
  <div className="step__label">AI Tools</div>
</div>

<div></div>
  className={`step ${activeSection === "reports" ? "step--active" : ""}`}
  onClick={() => setActiveSection("reports")}

  <div className="step__icon">📊</div>
  <div className="step__label">Saved Reports</div>
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
                        if (!requirePaid()) return;
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

{activeSection === "readiness" && (
<>
<ExportReadiness
  product={product}
  country={country}
  experience={experience}
  setProduct={setProduct}
  setCountry={setCountry}
  setExperience={setExperience}
  checkExport={checkExport}
  result={result}
  error={error}
  loading={loading}
/>
</>
)}

{activeSection === "pricing" && (
<>
<h1 className="sectionTitle">Pricing Tools</h1>
<PricingTools lockedHs={lockedHs} country={country} Card={Card} />
</>
)}

{activeSection === "market" && (
<>
<h1 className="sectionTitle">Market Intelligence</h1>
<MarketIntelligence Card={Card} />
</>
)}

{activeSection === "ai" && (
<>
<h1 className="sectionTitle">AI Tools</h1>

<AITools
  Card={Card}
  complianceScore={complianceScore}
/>

</>
)}

{activeSection === "reports" && (
<>
<h1 className="sectionTitle">Saved Reports</h1>

<ReportDetails
  selectedReport={selectedReport}
  reportResult={reportResult}
/>

</>
)}

</main>



</div>

</div>

);
}
