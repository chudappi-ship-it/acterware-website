import { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const callApi = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hello");
      const data = (await res.json()) as { message: string };
      setMessage(data.message);
    } catch (err) {
      setMessage("APIエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "system-ui, sans-serif",
      maxWidth: 600,
      margin: "0 auto",
      padding: "2rem",
      textAlign: "center",
    }}>
      <h1>SPA + Workers API</h1>
      <p>フロントエンドは静的アセット、APIはWorkerで動的処理</p>
      <button
        onClick={callApi}
        disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "通信中..." : "APIを呼ぶ"}
      </button>
      {message && (
        <p style={{ marginTop: "1rem", padding: "1rem", background: "#f0f0f0", borderRadius: 8 }}>
          {message}
        </p>
      )}
    </div>
  );
}
