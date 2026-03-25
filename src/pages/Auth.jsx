import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) setMsg(error.message);
  };

  const submitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("✅ Account created. Now sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 20 }}>
      <h2 style={{ marginBottom: 6 }}>Create your account</h2>
      <div style={{ opacity: 0.8, marginBottom: 18 }}>
        Use email/password or Google. Your export journeys will be saved securely.
      </div>

      <form onSubmit={submitEmail} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />

        <button
          disabled={loading || !email || !password}
          style={{
            padding: 10,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
        </button>

        <button
          type="button"
          onClick={signInWithGoogle}
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
            background: "white",
          }}
        >
          Continue with Google
        </button>
      </form>

      {msg ? <div style={{ marginTop: 12 }}>{msg}</div> : null}

      <div style={{ marginTop: 16 }}>
        {mode === "signup" ? (
          <span>
            Have an account?{" "}
            <button onClick={() => setMode("signin")}>Sign in</button>
          </span>
        ) : (
          <span>
            New here?{" "}
            <button onClick={() => setMode("signup")}>Create account</button>
          </span>
        )}
      </div>
    </div>
  );
}
