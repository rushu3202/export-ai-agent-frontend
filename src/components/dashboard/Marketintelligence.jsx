import ImporterFinder from "../ImporterFinder";
import BuyerFinder from "../BuyerFinder";
import MarketAnalyzer from "../MarketAnalyzer";
import MarketOpportunity from "../MarketOpportunity";

export default function MarketIntelligence({ Card }) {
  return (
    <>
      <Card
        title="Global Market Opportunity"
        subtitle="Find the best countries to export your product"
      >
        <MarketOpportunity />
      </Card>

      <h2 style={{ marginTop: 35, marginBottom: 10 }}>
        Market Intelligence
      </h2>

      <div className="toolGrid">
        <Card
          title="Global Importer Finder"
          subtitle="Find potential buyers in target markets"
        >
          <ImporterFinder />
        </Card>

        <Card
          title="AI Buyer Finder"
          subtitle="Discover potential importers and distributors"
        >
          <BuyerFinder />
        </Card>

        <Card
          title="Export Market Demand"
          subtitle="Discover which countries import your product most"
        >
          <MarketAnalyzer />
        </Card>
      </div>
    </>
  );
}