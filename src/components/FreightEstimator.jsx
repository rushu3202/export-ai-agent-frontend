import { useState } from "react";

export default function FreightEstimator() {
  const [origin, setOrigin] = useState("India");
  const [destination, setDestination] = useState("UK");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {
    const w = Number(weight);

    if (!w) return;

    // simple freight model
    const airRate = 4.5; // £ per kg
    const seaRate = 1.2; // £ per kg

    const airCost = w * airRate;
    const seaCost = w * seaRate;

    setResult({
      airCost,
      seaCost,
      airDays: 5,
      seaDays: 28
    });
  }

  return (
    <div>
      <h3>Freight Cost Estimator</h3>
      <p>Estimate shipping cost before exporting</p>

      <input
        type="text"
        placeholder="Origin Country"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />

      <input
        type="text"
        placeholder="Destination Country"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button onClick={calculate}>Estimate Freight</button>

      {result && (
        <div style={{ marginTop: "10px" }}>
          <p>✈️ Air Freight: £{result.airCost.toFixed(2)}</p>
          <p>Transit Time: {result.airDays} days</p>

          <p>🚢 Sea Freight: £{result.seaCost.toFixed(2)}</p>
          <p>Transit Time: {result.seaDays} days</p>
        </div>
      )}
    </div>
  );
}