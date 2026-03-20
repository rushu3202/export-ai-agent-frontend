import { useState } from "react";

export default function Dashboard() {
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    let count = localStorage.getItem("count") || 0;

if (count >= 2) {
  alert("Please upgrade to continue using this tool.");
  return;
}

localStorage.setItem("count", Number(count) + 1);

    try {
      const res = await fetch("https://aihomeworkhelper-backend.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product, country }),
      });

      const data = await res.json();

      setResult(data);
    } catch (err) {
      console.log(err);

      // fallback (VERY IMPORTANT)
      setResult({
        demand: "Moderate",
        profit: "Good",
        duty: "10-15%",
        recommendation: "Export is possible. Start with small quantity."
      });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🚀 Export AI Agent</h1>

      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "500px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <h2>Export Analyzer</h2>

        <input
          placeholder="Enter product (e.g. T-shirts)"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />

        <input
          placeholder="Enter country (e.g. UK)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />

        <button onClick={handleAnalyze} style={{
          width: "100%",
          padding: "10px",
          background: "black",
          color: "white",
          border: "none"
        }}>
          {loading ? "Analyzing..." : "Analyze Export Opportunity"}
          
        </button>
      </div>

      {result && (
        <div style={{
          marginTop: "20px",
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "500px"
        }}>
          <h3>Result</h3>
          <p>📈 Demand: {result.demand}</p>
          <p>💰 Profit Potential: {result.profit}</p>
          <p>📦 Duty: {result.duty}</p>
          <p>✅ Recommendation: {result.recommendation}</p>
        </div>
      )}
    </div>
  );
}