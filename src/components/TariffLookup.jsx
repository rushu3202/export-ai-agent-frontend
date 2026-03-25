import { useState } from "react";

export default function TariffLookup() {

  const [hs, setHs] = useState("");
  const [country, setCountry] = useState("");
  const [result, setResult] = useState(null);

  const tariffDB = {

    "6109": {
      UK: {
        duty: "12%",
        vat: "20%",
        agreement: "None",
        note: "Standard textile import duty for non-FTA countries."
      },

      USA: {
        duty: "16%",
        vat: "0%",
        agreement: "MFN",
        note: "Textile duties vary by material composition."
      }
    },

    "2008": {
      UK: {
        duty: "8%",
        vat: "20%",
        agreement: "None",
        note: "Prepared foods may require ingredient labeling."
      },

      USA: {
        duty: "10%",
        vat: "0%",
        agreement: "MFN",
        note: "Food imports may require FDA compliance."
      }
    }

  };

  function lookup() {

    const code = hs.trim();

    if (tariffDB[code] && tariffDB[code][country]) {

      setResult(tariffDB[code][country]);

    } else {

      setResult({
        duty: "Unknown",
        vat: "Unknown",
        agreement: "Unknown",
        note: "Tariff data not available yet for this HS code/country."
      });

    }
  }

  return (
    <div>

      Tariff & Duty Lookup
      <p>Check duties before exporting</p>

      <input
        placeholder="HS Code (example: 6109)"
        value={hs}
        onChange={(e) => setHs(e.target.value)}
      />

      <input
        placeholder="Country (UK, USA)"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <button onClick={lookup}>
        Lookup Tariff
      </button>

      {result && (
        <div style={{ marginTop: "10px" }}>

          <p>Duty: {result.duty}</p>

          <p>VAT: {result.vat}</p>

          <p>Trade Agreement: {result.agreement}</p>

          <p><b>Note:</b> {result.note}</p>

        </div>
      )}

    </div>
  );
}