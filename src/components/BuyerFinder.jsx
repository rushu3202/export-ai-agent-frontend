import { useState, useEffect } from "react";

export default function BuyerFinder() {
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("");
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPaidUser, setIsPaidUser] = useState(false);

  // ✅ Payment check (INSIDE component)
  useEffect(() => {
    async function checkPayment() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://export-ai-agent-backend.onrender.com/api/user-status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setIsPaidUser(data?.isPaid || false);
      } catch (err) {
        console.error(err);
        setIsPaidUser(false);
      }
    }

    checkPayment();
  }, []);

  // ✅ FREE vs PAID logic
  const displayedBuyers = isPaidUser
    ? buyers
    : buyers.slice(0, 1);

  async function findBuyers() {
    setLoading(true);
    setError("");
    setBuyers([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/find-buyers`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product,
            country,
          }),
        }
      );

      const data = await response.json();
      console.log("API RESPONSE:", data);

      setBuyers(data?.buyers || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch buyers");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>AI Buyer Finder</h2>
      <p>Discover potential importers and distributors</p>

      <input
        className="input"
        placeholder="Enter product (banana powder)"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />

      <input
        className="input"
        placeholder="Enter country (UK, USA)"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <button className="btn" onClick={findBuyers}>
        {loading ? "Searching..." : "Find Buyers"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && buyers.length === 0 && (
        <p>No buyers found yet. Try another product.</p>
      )}

      {/* 🔒 PAYWALL */}
      {!isPaidUser && buyers.length > 1 && (
        <div className="paywall" style={{ marginTop: "15px", color: "orange" }}>
          🔒 Unlock full buyer list + outreach messages  
          <br /><br />
          <button
            className="btn"
            onClick={() => window.location.href = "/pricing"}
          >
            Upgrade to Pro 🚀
          </button>
        </div>
      )}

      {/* ✅ BUYERS LIST */}
      {displayedBuyers.map((buyer, index) => (
        <div key={index} className="resultCard">
          <h3>{buyer.name}</h3>
          <p><strong>{buyer.type}</strong></p>
          <p>{buyer.reason}</p>

          <div style={{ marginTop: "10px" }}>
            <strong>Suggested Message:</strong>
            <p>{buyer.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}