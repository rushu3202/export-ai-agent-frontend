export default function ExportReadiness({
  product,
  country,
  experience,
  setProduct,
  setCountry,
  setExperience,
  checkExport,
  result,
  error,
  loading
}) {

  return (
    <div>

      <h2>Export Readiness</h2>

      <div className="grid">

        <div className="field">
          <label>Product</label>
          <input
            value={product}
            onChange={(e)=>setProduct(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Destination Country</label>
          <input
            value={country}
            onChange={(e)=>setCountry(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Experience</label>
          <select
            value={experience}
            onChange={(e)=>setExperience(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

      </div>

      <button
        className="btn"
        onClick={checkExport}
        disabled={loading}
      >
        {loading ? "Checking..." : "Check Export Readiness"}
      </button>

      {error && (
        <div className="alert alert--error">
          {error}
        </div>
      )}

      {result && (
        <div style={{marginTop:20}}>
          <strong>Risk Level:</strong> {result.risk_level}
        </div>
      )}

    </div>
  )

}