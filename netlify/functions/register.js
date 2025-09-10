// netlify/functions/register.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connectToDatabase } = require("./_mongo");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing fields" }) };
    }

    const { db } = await connectToDatabase();
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) return { statusCode: 409, body: JSON.stringify({ error: "User already exists" }) };

    const passwordHash = await bcrypt.hash(password, 10);
    const r = await users.insertOne({ name, email, passwordHash, role: "user", createdAt: new Date() });

    const token = jwt.sign({ sub: String(r.insertedId), email, role: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return { statusCode: 201, body: JSON.stringify({ user: { id: String(r.insertedId), name, email }, token }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
