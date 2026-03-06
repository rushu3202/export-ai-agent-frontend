import { useState } from "react";

export default function BuyerFinder() {
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("");
  const [buyers, setBuyers] = useState([]);

  function findBuyers() {

    const database = {
      "makhana": [
        { name: "Holland & Barrett", type: "Health Food Retailer" },
        { name: "Planet Organic", type: "Organic Grocery Chain" },
        { name: "Whole Foods UK", type: "Natural Food Retailer" }
      ],
      "spices": [
        { name: "TRS Foods", type: "Ethnic Food Distributor" },
        { name: "East End Foods", type: "Wholesale Spice Importer" },
        { name: "Natco Foods", type: "UK Asian Food Distributor" }
      ],
      "t-shirts": [
        { name: "ASOS", type: "Fashion Retailer" },
        { name: "Boohoo Group", type: "Clothing Retailer" },
        { name: "Primark", type: "Global Fashion Retailer" }
      ]
    };

    const key = product.toLowerCase();

    setBuyers(database[key] || []);
  }

  return (
    <div>

      <h3>AI Buyer Finder</h3>
      <p>Discover potential importers and distributors</p>

      <input
        type="text"
        placeholder="Product"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />

      <input
        type="text"
        placeholder="Destination Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <button onClick={findBuyers}>
        Find Buyers
      </button>

      {buyers.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {buyers.map((b, i) => (
            <p key={i}>
              <b>{b.name}</b> — {b.type}
            </p>
          ))}
        </div>
      )}

      {buyers.length === 0 && product && (
        <p>No buyers found yet. Try another product.</p>
      )}

    </div>
  );
}