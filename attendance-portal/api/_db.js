// Shared, cached MongoDB connection (reused across warm serverless invocations).
const { MongoClient } = require("mongodb");

let cached = global._mongoClientPromise;

async function getCollection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set");
  if (!cached) {
    cached = global._mongoClientPromise = new MongoClient(uri).connect();
  }
  const client = await cached;
  const db = client.db(process.env.DB_NAME || "LabAttendanceDB");
  return db.collection(process.env.COLLECTION_NAME || "attendance");
}

// Validate + sanitize body so only expected string fields reach the database.
function cleanRecord(body) {
  const fields = ["date", "subject", "section", "studentName"];
  const out = {};
  for (const f of fields) {
    const v = body && body[f];
    if (typeof v !== "string" || !v.trim()) {
      return { error: `Field "${f}" is required` };
    }
    out[f] = v.trim().slice(0, 100);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(out.date)) {
    return { error: "Date must be in YYYY-MM-DD format" };
  }
  return { value: out };
}

module.exports = { getCollection, cleanRecord };
