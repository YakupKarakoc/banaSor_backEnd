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

const deleteSoru = async (req, res) => {
  const soruId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM Soru WHERE soruId = $1 RETURNING *",
      [soruId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Silinecek soru bulunamadı." });
    }

    res.status(200).json({
      message: "Soru başarıyla silindi.",
      deletedSoru: result.rows[0],
    });
  } catch (error) {
    console.error("Soru silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

const deleteCevap = async (req, res) => {
  const cevapId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM Cevap WHERE cevapId = $1 RETURNING *",
      [cevapId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Silinecek cevap bulunamadı." });
    }

    res.status(200).json({
      message: "Cevap başarıyla silindi.",
      deletedCevap: result.rows[0],
    });
  } catch (error) {
    console.error("Cevap silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

const deleteGrup = async (req, res) => {
  const grupId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM Grup WHERE grupId = $1 RETURNING *",
      [grupId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Silinecek grup bulunamadı." });
    }

    res.status(200).json({
      message: "Grup başarıyla silindi.",
      deletedGrup: result.rows[0],
    });
  } catch (error) {
    console.error("Grup silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

module.exports = {
  deleteForum,
  deleteEntry,
  deleteSoru,
  deleteCevap,
  deleteGrup,
};
