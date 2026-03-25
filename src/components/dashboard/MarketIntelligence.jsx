import ImporterFinder from "../ImporterFinder"
import BuyerFinder from "../BuyerFinder"
import MarketAnalyzer from "../MarketAnalyzer"
import MarketOpportunity from "../MarketOpportunity"
import MarketOpportunityScanner from "../MarketOpportunityScanner"
import BuyerDiscoveryEngine from "./BuyerDiscoveryEngine"


export default function MarketIntelligence({ Card }) {

  return (

    <>

      {/* AI Opportunity Scanner */}

      <Card
        title="AI Export Opportunity Scanner"
        subtitle="Evaluate export potential before entering a market"
      >
        <MarketOpportunityScanner />
      </Card>

      <Card
title="Buyer Discovery Engine"
subtitle="Find importers and distributors in your target market"
>
<BuyerDiscoveryEngine/>
</Card>



      {/* Market Opportunity */}

      <Card
        title="Global Market Opportunity"
        subtitle="Find the best countries to export your product"
      >
        <MarketOpportunity />
      </Card>


      {/* Market Intelligence Tools */}

      <h2 style={{ marginTop: "35px", marginBottom: "10px" }}>
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

  )

}
