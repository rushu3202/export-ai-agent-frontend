import AIAdvisor from "../AIAdvisor";

export default function AITools({ Card, complianceScore }) {
  return (
    <>
      <h2 style={{ marginTop: 35, marginBottom: 10 }}>
        AI Tools
      </h2>

      <div className="toolGrid">
        <Card
          title="AI Export Advisor"
          subtitle="Ask AI about exporting rules, duties, or documents"
        >
          <AIAdvisor />
        </Card>

        {complianceScore && (
          <Card
            title="Compliance Confidence Score"
            subtitle="AI estimate of export readiness"
          >
            <div style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>
              {complianceScore.total}%
            </div>

            <ul className="list">
              <li className="list__item">
                HS Code Clarity: {complianceScore.hsScore}%
              </li>

              <li className="list__item">
                Documents Completeness: {complianceScore.docsScore}%
              </li>

              <li className="list__item">
                Country Risk: {complianceScore.riskScore}%
              </li>

              <li className="list__item">
                Exporter Experience: {complianceScore.experienceScore}%
              </li>
            </ul>
          </Card>
        )}
      </div>
    </>
  );
}