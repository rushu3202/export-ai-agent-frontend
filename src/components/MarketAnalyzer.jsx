import { useState } from "react";

export default function MarketAnalyzer() {

  const [product, setProduct] = useState("");
  const [markets, setMarkets] = useState([]);

  function analyzeMarket() {

    const data = {

      spices: [
        { country: "USA", demand: "Very High" },
        { country: "UK", demand: "High" },
        { country: "Germany", demand: "Medium" },
        { country: "Canada", demand: "High" }
      ],

      makhana: [
        { country: "USA", demand: "High" },
        { country: "UK", demand: "Medium" },
        { country: "Australia", demand: "Medium" },
        { country: "UAE", demand: "High" }
      ],

      "t-shirts": [
        { country: "USA", demand: "Very High" },
        { country: "UK", demand: "High" },
        { country: "France", demand: "High" },
        { country: "Germany", demand: "Medium" }
      ]

    };

    const key = product.toLowerCase();

    setMarkets(data[key] || []);
  }

  return (
    <div>

      <h3>Export Market Demand Analyzer</h3>
      <p>Identify countries with strong import demand</p>

      <input
        type="text"
        placeholder="Enter product"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />

      <button onClick={analyzeMarket}>
        Analyze Markets
      </button>

      {markets.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {markets.map((m, i) => (
            <p key={i}>
              🌍 <b>{m.country}</b> — {m.demand} Demand
            </p>
          ))}
        </div>
      )}

      {markets.length === 0 && product && (
        <p>No data yet for this product.</p>
      )}

    </div>
  );
}