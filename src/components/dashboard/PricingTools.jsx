import LandedCostCalculator from "../LandedCostCalculator";
import ProfitSimulator from "../ProfitSimulator";
import FreightEstimator from "../FreightEstimator";
import TariffLookup from "../TariffLookup";

export default function PricingTools({ lockedHs, country, Card }) {
  return (
    <>
      <h2 className="sectionTitle">Pricing Tools</h2>
      <button
  className="btn"
  onClick={async () => {
    const res = await fetch(
      "https://export-ai-agent-backend.onrender.com/api/create-checkout-session",
      {
        method: "POST",
      }
    );

    const data = await res.json();
    window.location.href = data.url;
  }}
>
  Buy Pro (£9/month)
</button>

      <div className="toolGrid">
        <Card title="Landed Cost Calculator">
          <LandedCostCalculator hsCode={lockedHs?.code} country={country} />
        </Card>

        <Card title="Export Profit Simulator">
          <ProfitSimulator />
        </Card>

        <Card title="Freight Cost Estimator">
          <FreightEstimator />
        </Card>

        <Card title="Tariff Lookup">
          <TariffLookup hsCode={lockedHs?.code} country={country} />
        </Card>
      </div>
    </>
  );
}