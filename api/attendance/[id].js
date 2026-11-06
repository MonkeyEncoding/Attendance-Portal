// Handles: PUT/PATCH (update), DELETE  ->  /api/attendance/:id
const { ObjectId } = require("mongodb");
const { getCollection, cleanRecord } = require("../_db");

module.exports = async (req, res) => {
  try {
    const { id } = req.query;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid record id" });
    }
    const _id = new ObjectId(id);
    const col = await getCollection();

    if (req.method === "PUT" || req.method === "PATCH") {
      const { value, error } = cleanRecord(req.body);
      if (error) return res.status(400).json({ error });
      const result = await col.updateOne({ _id }, { $set: value });
      if (!result.matchedCount) return res.status(404).json({ error: "Record not found" });
      return res.status(200).json({ _id: id, ...value });
    }

    if (req.method === "DELETE") {
      const result = await col.deleteOne({ _id });
      if (!result.deletedCount) return res.status(404).json({ error: "Record not found" });
      return res.status(200).json({ deleted: true });
    }

    res.setHeader("Allow", "PUT, PATCH, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error. Check database connection." });
  }
};
