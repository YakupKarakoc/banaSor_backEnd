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

const guncelleBolumAktiflik = async (req, res) => {
  const { bolumId } = req.params;
  const { aktifMi } = req.body;

  if (typeof aktifMi !== "boolean") {
    return res
      .status(400)
      .json({ error: "aktifMi alanı true veya false olmalıdır." });
  }

  try {
    // 1. Mevcut aktifMi değerini al
    const result = await pool.query(
      "SELECT aktifMi FROM Bolum WHERE bolumId = $1",
      [bolumId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: `bolumId ${bolumId} bulunamadı.` });
    }

    const mevcutDurum = result.rows[0].aktifmi;

    // 2. Aynıysa güncelleme yapma
    if (mevcutDurum === aktifMi) {
      return res.status(200).json({
        message: `bolumId ${bolumId} zaten ${
          aktifMi ? "aktif" : "pasif"
        }. Güncelleme yapılmadı.`,
      });
    }

    // 3. Farklıysa güncelle
    await pool.query("UPDATE Bolum SET aktifMi = $1 WHERE bolumId = $2", [
      aktifMi,
      bolumId,
    ]);

    return res.status(200).json({
      message: `bolumId ${bolumId} aktifMi durumu ${aktifMi} olarak güncellendi.`,
    });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({ error: "Sunucu hatası." });
  }
};

const guncelleFakulteAktiflik = async (req, res) => {
  const { fakulteId } = req.params;
  const { aktifMi } = req.body;

  if (typeof aktifMi !== "boolean") {
    return res
      .status(400)
      .json({ error: "aktifMi alanı true veya false olmalıdır." });
  }

  try {
    const result = await pool.query(
      "SELECT aktifMi FROM Fakulte WHERE fakulteId = $1",
      [fakulteId]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: `fakulteId ${fakulteId} bulunamadı.` });
    }

    const mevcutDurum = result.rows[0].aktifmi;

    if (mevcutDurum === aktifMi) {
      return res.status(200).json({
        message: `fakulteId ${fakulteId} zaten ${
          aktifMi ? "aktif" : "pasif"
        }. Güncelleme yapılmadı.`,
      });
    }

    await pool.query("UPDATE Fakulte SET aktifMi = $1 WHERE fakulteId = $2", [
      aktifMi,
      fakulteId,
    ]);

    return res.status(200).json({
      message: `fakulteId ${fakulteId} aktifMi durumu ${aktifMi} olarak güncellendi.`,
    });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({ error: "Sunucu hatası." });
  }
};

const guncelleKullaniciAktiflik = async (req, res) => {
  const { kullaniciId } = req.params;
  const { aktifMi } = req.body;

  if (typeof aktifMi !== "boolean") {
    return res
      .status(400)
      .json({ error: "aktifMi alanı true veya false olmalıdır." });
  }

  try {
    const result = await pool.query(
      "SELECT aktifMi FROM Kullanici WHERE kullaniciId = $1",
      [kullaniciId]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: `kullaniciId ${kullaniciId} bulunamadı.` });
    }

    const mevcutDurum = result.rows[0].aktifmi;

    if (mevcutDurum === aktifMi) {
      return res.status(200).json({
        message: `kullaniciId ${kullaniciId} zaten ${
          aktifMi ? "aktif" : "pasif"
        }. Güncelleme yapılmadı.`,
      });
    }

    await pool.query(
      "UPDATE Kullanici SET aktifMi = $1 WHERE kullaniciId = $2",
      [aktifMi, kullaniciId]
    );

    return res.status(200).json({
      message: `kullaniciId ${kullaniciId} aktifMi durumu ${aktifMi} olarak güncellendi.`,
    });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({ error: "Sunucu hatası." });
  }
};

module.exports = {
  deleteForum,
  deleteEntry,
  deleteSoru,
  deleteCevap,
  deleteGrup,
  guncelleBolumAktiflik,
  guncelleFakulteAktiflik,
  guncelleKullaniciAktiflik,
};
