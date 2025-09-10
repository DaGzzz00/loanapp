import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/.netlify/functions/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) setMsg(data.error || "Error");
      else setMsg("Registered! Token: " + data.token.slice(0, 20) + "...");
    } catch (err) {
      setMsg("Server error");
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Register (Test)</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <br />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <br />
        <button>Register</button>
      </form>
      <div style={{ marginTop: 10 }}>{msg}</div>
    </div>
  );
}
