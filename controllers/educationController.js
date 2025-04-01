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
    let query = "SELECT * FROM Universite WHERE 1=1";
    let values = [];

    if (ad) {
      query += " AND ad ILIKE $1";
      values.push(`%${ad}%`);
    }
    if (sehirId) {
      query += ` AND sehirId = $${values.length + 1}`;
      values.push(sehirId);
    }
    if (aktifMi !== undefined) {
      query += ` AND aktifMi = $${values.length + 1}`;
      values.push(aktifMi === "true");
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
    let query = "SELECT * FROM Fakulte WHERE 1=1";
    let values = [];

    if (ad) {
      query += " AND ad ILIKE $1";
      values.push(`%${ad}%`);
    }
    if (universiteId) {
      query += ` AND universiteId = $${values.length + 1}`;
      values.push(universiteId);
    }
    if (aktifMi !== undefined) {
      query += ` AND aktifMi = $${values.length + 1}`;
      values.push(aktifMi === "true");
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
    let query = "SELECT * FROM Bolum WHERE 1=1";
    let values = [];

    if (ad) {
      query += " AND ad ILIKE $1";
      values.push(`%${ad}%`);
    }
    if (universiteId) {
      query += ` AND universiteId = $${values.length + 1}`;
      values.push(universiteId);
    }
    if (fakulteId) {
      query += ` AND fakulteId = $${values.length + 1}`;
      values.push(fakulteId);
    }
    if (aktifMi !== undefined) {
      query += ` AND aktifMi = $${values.length + 1}`;
      values.push(aktifMi === "true");
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Bölüm Listeleme Hatası:", error.message);
    next(error);
  }
};
