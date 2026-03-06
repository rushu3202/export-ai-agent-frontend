import { useState } from "react";

export default function AIAdvisor() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  async function askAI() {

    if (!question) return;

    try {

      setLoading(true);

      const res = await fetch(`${API_URL}/api/ai-advisor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: question
        })
      });

      const data = await res.json();

      setAnswer(data.answer || "No response");

    } catch (err) {

      setAnswer("AI service unavailable");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div>

      <h3>AI Export Advisor</h3>
      <p>Ask anything about exporting</p>

      <input
        type="text"
        placeholder="Ask about exporting..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={askAI}>
        Ask AI
      </button>

      {loading && <p>Thinking...</p>}

      {answer && (
        <div style={{ marginTop: "10px" }}>
          <b>AI Answer:</b>
          <p>{answer}</p>
        </div>
      )}

    </div>
  );
}