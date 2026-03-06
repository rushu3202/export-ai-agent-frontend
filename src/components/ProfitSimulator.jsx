import { useState } from "react";

export default function ProfitSimulator() {

  const [cost, setCost] = useState("");
  const [freight, setFreight] = useState("");
  const [duty, setDuty] = useState("");
  const [vat, setVat] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {

    const productCost = Number(cost);
    const freightCost = Number(freight);
    const dutyCost = Number(duty);
    const vatCost = Number(vat);
    const selling = Number(sellingPrice);

    const totalCost = productCost + freightCost + dutyCost + vatCost;

    const profit = selling - totalCost;

    const margin = selling ? (profit / selling) * 100 : 0;

    setResult({
      totalCost,
      profit,
      margin
    });
  }

  return (
    <div>

      <h3>Export Profit Simulator</h3>
      <p>Calculate export profit and margin before shipping</p>

      <input
        type="number"
        placeholder="Product Cost (£)"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />

      <input
        type="number"
        placeholder="Freight Cost (£)"
        value={freight}
        onChange={(e) => setFreight(e.target.value)}
      />

      <input
        type="number"
        placeholder="Duty (£)"
        value={duty}
        onChange={(e) => setDuty(e.target.value)}
      />

      <input
        type="number"
        placeholder="VAT (£)"
        value={vat}
        onChange={(e) => setVat(e.target.value)}
      />

      <input
        type="number"
        placeholder="Selling Price (£)"
        value={sellingPrice}
        onChange={(e) => setSellingPrice(e.target.value)}
      />

      <button onClick={calculate}>
        Calculate Profit
      </button>

      {result && (
        <div style={{ marginTop: "10px" }}>
          <p>Total Cost: £{result.totalCost.toFixed(2)}</p>
          <p>Profit per Unit: £{result.profit.toFixed(2)}</p>
          <p>Margin: {result.margin.toFixed(1)}%</p>
        </div>
      )}

    </div>
  );
}