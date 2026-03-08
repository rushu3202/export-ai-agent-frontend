import { useState } from "react";

export default function ImporterFinder() {

  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("");
  const [results, setResults] = useState([]);

  const importerDB = {
    spices: {
      UK: ["TRS Foods", "East End Foods", "Natco Foods"],
      USA: ["Badia Spices", "Frontier Co-op", "McCormick"]
    },
    textile: {
      UK: ["Primark Suppliers", "Marks & Spencer Import", "Next PLC"],
      USA: ["Gap Inc", "Target Apparel", "Walmart Sourcing"]
    },
    food: {
      UK: ["Tesco Import Division", "Sainsbury Buying Team", "ASDA Global Sourcing"],
      USA: ["Kroger Imports", "Costco Wholesale", "Whole Foods Market"]
    }
  };

  function search() {

    const key = product.toLowerCase();

    if (importerDB[key] && importerDB[key][country]) {
      setResults(importerDB[key][country]);
    } else {
      setResults(["No importer data yet for this product/country"]);
    }
  }

  return (
    <div>

      Global Importer Finder
      <p>Discover potential buyers in target markets</p>

      <input
        placeholder="Product (spices, textile, food)"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />

      <input
        placeholder="Country (UK, USA)"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <button onClick={search}>
        Find Importers
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h4>Potential Importers</h4>
          <ul>
            {results.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}