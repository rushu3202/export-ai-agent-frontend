import { useState } from "react";
const tariffTable = {
  "6109": { UK: { duty: 12, vat: 20 } },
  "2008": { UK: { duty: 8, vat: 20 } },
  "0904": { UK: { duty: 0, vat: 20 } }
};

export default function LandedCostCalculator({ hsCode, country }) {
  const rates = {
    UK: { duty: 5, vat: 20 },
    USA: { duty: 3, vat: 0 },
    Germany: { duty: 6, vat: 19 },
    India: { duty: 10, vat: 18 }
  };

  const [productCost, setProductCost] = useState("");
  const [freight, setFreight] = useState("");
  const [insurance, setInsurance] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const cost = Number(productCost) || 0;
    const ship = Number(freight) || 0;
    const ins = Number(insurance) || 0;

    const { duty, vat } = rates[country];

    const cif = cost + ship + ins;

    const dutyAmount = cif * (duty / 100);
    const vatAmount = (cif + dutyAmount) * (vat / 100);

    const total = cif + dutyAmount + vatAmount;

    const suggested = total * 1.3;

    const sell = sellingPrice ? Number(sellingPrice) : suggested;

    const profit = sell - total;

    const margin = (profit / sell) * 100;

    setResult({
      duty,
      vat,
      total,
      suggested,
      profit,
      margin
    });
  };

  return (
    <div style={{ display: "grid", gap: "10px" }}>
      <input
        type="number"
        placeholder="Product Cost"
        value={productCost}
        onChange={(e) => setProductCost(e.target.value)}
      />

      <input
        type="number"
        placeholder="Freight"
        value={freight}
        onChange={(e) => setFreight(e.target.value)}
      />

      <input
        type="number"
        placeholder="Insurance"
        value={insurance}
        onChange={(e) => setInsurance(e.target.value)}
      />

      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        {Object.keys(rates).map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Selling Price (optional)"
        value={sellingPrice}
        onChange={(e) => setSellingPrice(e.target.value)}
      />

      <button className="btn" onClick={calculate}>
        Calculate
      </button>

      {result && (
        <div style={{ marginTop: "10px" }}>
          <p>Duty: {result.duty}%</p>

          <p>VAT: {result.vat}%</p>

          <p>
            Total Landed Cost: £{result.total.toFixed(2)}
          </p>

          <p>
            Suggested Selling Price: £{result.suggested.toFixed(2)}
          </p>

          <p>
            Profit: £{result.profit.toFixed(2)}
          </p>

          <p>
            Profit Margin: {result.margin.toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
}