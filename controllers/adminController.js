const pool = require("../config/db");

const deleteForum = async (req, res) => {
  const forumId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM Forum WHERE forumId = $1 RETURNING *",
      [forumId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Silinecek forum bulunamadı." });
    }

    res.status(200).json({
      message: "Forum başarıyla silindi.",
      deletedForum: result.rows[0],
    });
  } catch (error) {
    console.error("Forum silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

const deleteEntry = async (req, res) => {
  const entryId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM Entry WHERE entryId = $1 RETURNING *",
      [entryId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Silinecek entry bulunamadı." });
    }

    res.status(200).json({
      message: "Entry başarıyla silindi.",
      deletedEntry: result.rows[0],
    });
  } catch (error) {
    console.error("Entry silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

module.exports = {
  deleteForum,
  deleteEntry,
};
