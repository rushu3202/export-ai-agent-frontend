import { useState } from "react";

export default function Dashboard() {
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("");
  const [result, setResult] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleAnalyze = () => {
    if (!product || !country) {
      alert("Please enter product and country");
      return;
    }

    let count = localStorage.getItem("count") || 0;

    if (count >= 2) {
      setShowUpgrade(true);
      return;
    }

    localStorage.setItem("count", Number(count) + 1);

    const lowerProduct = product.toLowerCase();

    let data;

    if (lowerProduct.includes("makhana")) {
      data = {
        demand: "High demand in UK health snack market",
        profit: "40–60% margins possible",
        duty: "8–12% + VAT",
        buyers: ["Health stores", "Indian importers", "Amazon sellers"],
        steps: ["Food certification", "Packaging", "Find UK distributor"],
        recommendation: "Strong niche opportunity"
      };
    } else if (lowerProduct.includes("t-shirt")) {
      data = {
        demand: "Strong demand in UK fashion market",
        profit: "30–50% margins",
        duty: "12% + VAT",
        buyers: ["Retail chains", "Online sellers"],
        steps: ["Find buyers", "Start small shipment"],
        recommendation: "Competitive but scalable"
      };
    } else {
      data = {
        demand: `Demand exists for ${product} in ${country}`,
        profit: "20–40%",
        duty: "5–15%",
        buyers: ["Importers", "Online sellers"],
        steps: ["Test market", "Find buyers"],
        recommendation: "Start small and validate"
      };
    }

    setResult(data);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white"
    }}>
      <div style={{
        background: "#1e293b",
        padding: "30px",
        borderRadius: "15px",
        width: "400px"
      }}>
        <h1 style={{ textAlign: "center" }}>🚀 Export AI Agent</h1>
        <p style={{ marginTop: "10px" }}>
  🔓 Unlock Full Export Strategy  
  (Detailed buyers, pricing plan & step-by-step execution)
</p>
        <div style={{ marginBottom: "15px" }}>
  <input
    type="text"
    placeholder="Product (e.g. Makhana)"
    value={product}
    onChange={(e) => setProduct(e.target.value)}
    style={{
      width: "100%",
      padding: "12px",
      marginBottom: "10px",
      borderRadius: "6px",
      border: "none",
      color: "black"
    }}
  />

  <input
    type="text"
    placeholder="Country (e.g. UK)"
    value={country}
    onChange={(e) => setCountry(e.target.value)}
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "6px",
      border: "none",
      color: "black"
    }}
  />
</div>
Product (e.g. Makhana)
Country (e.g. UK)

        <button
          onClick={handleAnalyze}
          style={{
            width: "100%",
            padding: "10px",
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "8px"
          }}
        >
          Analyze Export
        </button>
        
<p style={{ marginTop: "15px", fontSize: "12px", opacity: 0.6 }}>
  Used by exporters to validate opportunities before investing
</p>

        {result && (
          <div style={{ marginTop: "20px" }}>
            <h3>📊 Export Report</h3>

            <p><strong>Demand:</strong> {result.demand}</p>
            <p><strong>Profit:</strong> {result.profit}</p>
            <p><strong>Duty:</strong> {result.duty}</p>

            <h4>🎯 Buyers</h4>
            <ul>
              {result.buyers.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <h4>📦 Steps</h4>
            <ul>
              {result.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <p><strong>Advice:</strong> {result.recommendation}</p>
          </div>
        )}

        {showUpgrade && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <h3>🔒 Upgrade Required</h3>
            <p>Unlock full export plan</p>

            <button
              onClick={() => window.location.href = "https://buy.stripe.com/dRm28rfjVf4B7Mm70U8bS01"}
              style={{
                padding: "10px",
                background: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                width: "100%"
              }}
            >
              💳 Get Full Export Plan – £5
            </button>
          </div>
        )}
      </div>
    </div>
  );
}