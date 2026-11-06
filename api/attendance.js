// Handles: GET (list), POST (create)  ->  /api/attendance
const { getCollection, cleanRecord } = require("./_db");

module.exports = async (req, res) => {
  try {
    const col = await getCollection();

    if (req.method === "GET") {
      const docs = await col.find({}).sort({ date: -1, _id: -1 }).toArray();
      return res.status(200).json(docs);
    }

    if (req.method === "POST") {
      const { value, error } = cleanRecord(req.body);
      if (error) return res.status(400).json({ error });
      const result = await col.insertOne(value);
      return res.status(201).json({ _id: result.insertedId, ...value });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error. Check database connection." });
  }
};
