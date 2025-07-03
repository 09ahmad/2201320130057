// src/App.tsx
import { useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";

export default function App() {
  const [url, setUrl] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [validity, setValidity] = useState(30);
  const [shortLink, setShortLink] = useState("");
  const [expiry, setExpiry] = useState("");

  const [lookupCode, setLookupCode] = useState("");
  const [lookupResult, setLookupResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/shortner`, {
        url,
        shortcode: shortcode || undefined,
        validity: Number(validity),
      });
      // @ts-ignore
      setShortLink(res.data.shortLink);
      // @ts-ignore
      setExpiry(res.data.expiry);
    } catch (err: any) {
      alert(err.response?.data?.msg || "Something went wrong");
    }
  };

 const handleLookup = async () => {
  try {
    const code = lookupCode.trim().split("/").pop(); 
    const res = await axios.get(`${API}/shorturls/${code}`);
    setLookupResult(res.data);
  } catch (err: any) {
    alert(err.response?.data?.error || "Shortcode not found");
  }
};


  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 600, margin: "auto" }}>
      <h2>🔗 URL Shortener</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="url"
          placeholder="Enter full URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Optional shortcode"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <input
          type="number"
          min={1}
          placeholder="Validity (minutes)"
          value={validity}
          onChange={(e) => setValidity(Number(e.target.value))}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Create Short URL
        </button>
      </form>

      {shortLink && (
        <div style={{ marginBottom: "1rem" }}>
          <p> Short Link: <a href={shortLink} target="_blank">{shortLink}</a></p>
          <p> Expires at: {new Date(expiry).toLocaleString()}</p>
        </div>
      )}

      <hr />

      <h3>🔍 Lookup Short URL</h3>
      <input
        type="text"
        placeholder="Enter shortcode"
        value={lookupCode}
        onChange={(e) => setLookupCode(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <button onClick={handleLookup} style={{ padding: "0.5rem 1rem" }}>
        Lookup
      </button>

      {lookupResult && (
        <div style={{ marginTop: "1rem" }}>
          <p> Original URL: <a href={lookupResult.originalUrl} target="_blank">{lookupResult.originalUrl}</a></p>
          <p>Expires: {new Date(lookupResult.expiry).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
