import { useState } from "react";

export default function BuyerDiscovery() {

  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("");
  const [results, setResults] = useState([]);

  const buyerDB = {

    spices: {
      UK: [
        { name: "TRS Foods", type: "Importer / Distributor", website: "https://trsfoods.com" },
        { name: "East End Foods", type: "Importer", website: "https://eastendfoods.co.uk" },
        { name: "Natco Foods", type: "Importer", website: "https://natcofoods.com" }
      ],

      USA: [
        { name: "Badia Spices", type: "Importer", website: "https://badiaspices.com" },
        { name: "Frontier Co-op", type: "Distributor", website: "https://frontiercoop.com" },
        { name: "McCormick", type: "Importer", website: "https://mccormick.com" }
      ]
    },

    textile: {
      UK: [
        { name: "Primark", type: "Retail Importer", website: "https://primark.com" },
        { name: "Marks & Spencer", type: "Retail Importer", website: "https://marksandspencer.com" },
        { name: "Next PLC", type: "Retail Importer", website: "https://next.co.uk" }
      ]
    }

  };

  function searchBuyers() {

    const key = product.toLowerCase();

    if (buyerDB[key] && buyerDB[key][country]) {
      setResults(buyerDB[key][country]);
    } else {
      setResults([
        { name: "No buyers found yet", type: "-", website: "-" }
      ]);
    }
  }

  return (
    <div>

      <h3>Buyer Discovery</h3>
      <p>Find potential importers in your target market</p>

      <input
        placeholder="Product (spices, textile)"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />

      <input
        placeholder="Country (UK, USA)"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <button onClick={searchBuyers}>
        Find Buyers
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <h4>Potential Buyers</h4>

          {results.map((buyer, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>

              <strong>{buyer.name}</strong>

              <p>Type: {buyer.type}</p>

              <p>
                Website:{" "}
                <a href={buyer.website} target="_blank">
                  {buyer.website}
                </a>
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}