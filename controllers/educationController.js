const pool = require("../config/db");

exports.city = async (req, res, next) => {
  try {
    const { ad } = req.query;
    let query = "SELECT * FROM Sehir";
    let values = [];

    if (ad) {
      query += " WHERE ad ILIKE $1";
      values.push(`%${ad}%`);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Şehir Listeleme Hatası:", error.message);
    next(error);
  }
};

// Üniversiteleri listeleme ve filtreleme
exports.university = async (req, res, next) => {
  try {
    const { ad, sehirId, aktifMi } = req.query;
    let query = `
      SELECT 
        u.universiteId,
        u.ad AS universiteAdi,
        s.ad AS sehirAdi,
        u.aktifMi
      FROM Universite u
      JOIN Sehir s ON u.sehirId = s.sehirId
      WHERE 1=1
    `;
    const values = [];
    let index = 1;

    if (ad) {
      query += ` AND u.ad ILIKE $${index}`;
      values.push(`%${ad}%`);
      index++;
    }
    if (sehirId) {
      query += ` AND u.sehirId = $${index}`;
      values.push(sehirId);
      index++;
    }
    if (aktifMi !== undefined) {
      query += ` AND u.aktifMi = $${index}`;
      values.push(aktifMi === "true");
      index++;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Üniversite Listeleme Hatası:", error.message);
    next(error);
  }
};

// Fakülteleri listeleme ve filtreleme
exports.faculty = async (req, res, next) => {
  try {
    const { ad, universiteId, aktifMi } = req.query;
    let query = `
      SELECT 
        f.fakulteId,
        f.ad AS fakulteAdi,
        u.ad AS universiteAdi,
        f.aktifMi
      FROM Fakulte f
      JOIN Universite u ON f.universiteId = u.universiteId
      WHERE 1=1
    `;
    const values = [];
    let index = 1;

    if (ad) {
      query += ` AND f.ad ILIKE $${index}`;
      values.push(`%${ad}%`);
      index++;
    }
    if (universiteId) {
      query += ` AND f.universiteId = $${index}`;
      values.push(universiteId);
      index++;
    }
    if (aktifMi !== undefined) {
      query += ` AND f.aktifMi = $${index}`;
      values.push(aktifMi === "true");
      index++;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Fakülte Listeleme Hatası:", error.message);
    next(error);
  }
};

// Bölümleri listeleme ve filtreleme
exports.department = async (req, res, next) => {
  try {
    const { ad, universiteId, fakulteId, aktifMi } = req.query;
    let query = `
      SELECT 
        b.bolumId,
        b.ad AS bolumAdi,
        u.ad AS universiteAdi,
        f.ad AS fakulteAdi,
        b.aktifMi
      FROM Bolum b
      JOIN Universite u ON b.universiteId = u.universiteId
      JOIN Fakulte f ON b.fakulteId = f.fakulteId
      WHERE 1=1
    `;
    const values = [];
    let index = 1;

    if (ad) {
      query += ` AND b.ad ILIKE $${index}`;
      values.push(`%${ad}%`);
      index++;
    }
    if (universiteId) {
      query += ` AND b.universiteId = $${index}`;
      values.push(universiteId);
      index++;
    }
    if (fakulteId) {
      query += ` AND b.fakulteId = $${index}`;
      values.push(fakulteId);
      index++;
    }
    if (aktifMi !== undefined) {
      query += ` AND b.aktifMi = $${index}`;
      values.push(aktifMi === "true");
      index++;
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bölüm bulunamadı" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Bölüm Listeleme Hatası:", error.message);
    next(error);
  }
};
