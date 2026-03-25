import { useState } from "react"

export default function MarketOpportunityScanner() {

  const [product,setProduct] = useState("")
  const [data, setData] = useState([]);
  const [results,setResults] = useState(null)
  const [loading,setLoading] = useState(false)
  
  
  const calculateScore = (market) => {
  let score = 50;

  if (market.demand === "High") score += 30;
  if (market.competition === "Low") score += 20;
  if (market.competition === "High") score -= 10;

  return Math.min(score, 100);
};
{data.length > 0 && (
  <div style={{ marginTop: "20px" }}>
    <h3>Top Export Markets</h3>

    {data.map((m, i) => {
      const score = calculateScore(m);

      return (
        <div key={i} className="card" style={{ marginBottom: "10px" }}>
          <h3>{m.country}</h3>

          <p>Demand: {m.demand}</p>
          <p>Competition: {m.competition}</p>

          <h2 style={{ color: score > 80 ? "green" : score > 60 ? "orange" : "red" }}>
            Score: {score}/100
          </h2>
        </div>
      );
    })}
  </div>
)}

  const analyzeMarket = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API_URL}/api/market-opportunity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ product })
    });

    if (!res.ok) {
      throw new Error("API request failed");
    }

    const result = await res.json();

    setData(result.markets || []); // ✅ THIS LINE IS KEY

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  return (

    <div>

      <input
        className="input"
        placeholder="Enter product (example: banana powder)"
        value={product}
        onChange={(e)=>setProduct(e.target.value)}
      />

      <button
        className="btn"
        onClick={analyzeMarket}
      >
        Analyze Market
      </button>

      {loading && (
        <div className="muted" style={{marginTop:10}}>
          Analyzing markets...
        </div>
      )}

      {results && (

        <div style={{marginTop:20}}>

          {results.map((m,i)=>(

            <div key={i} className="hsRow">

              <div className="hsText">

                <b>{m.country}</b>

                <div className="muted">
                  Opportunity Score: {m.score}
                </div>

                <div className="muted">
                  Demand: {m.demand}
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}
