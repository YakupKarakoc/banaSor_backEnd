const pool = require("../config/db");

const takipEt = async (req, res) => {
  const { universiteId } = req.params;
  const kullaniciId = req.user.kullaniciId;

  console.log("universiteId:", universiteId);
  console.log("kullaniciId:", kullaniciId);

  if (!universiteId || !kullaniciId) {
    return res.status(400).json({ error: "Eksik veri" });
  }

  try {
    await pool.query(
      `
      INSERT INTO UniversiteTakip (universiteId, kullaniciId)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `,
      [universiteId, kullaniciId]
    );

    res.status(200).json({ message: "Takip edildi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const takiptenCik = async (req, res) => {
  const { universiteId } = req.params;
  const kullaniciId = req.user.kullaniciId;

  try {
    await pool.query(
      `
      DELETE FROM UniversiteTakip
      WHERE universiteId = $1 AND kullaniciId = $2
    `,
      [universiteId, kullaniciId]
    );

    res.status(200).json({ message: "Takipten çıkıldı" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const takipDurumu = async (req, res) => {
  const { universiteId } = req.params;
  const kullaniciId = req.user.kullaniciId;

  try {
    const result = await pool.query(
      `
      SELECT 1 FROM UniversiteTakip
      WHERE universiteId = $1 AND kullaniciId = $2
    `,
      [universiteId, kullaniciId]
    );

    const takipEdiyorMu = result.rowCount > 0;
    res.status(200).json({ takipEdiyorMu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const getirTakipEdilenler = async (req, res) => {
  const kullaniciId = req.user.kullaniciId;

  try {
    const result = await pool.query(
      `
      SELECT u.ad
      FROM UniversiteTakip ut
      JOIN Universite u ON u.universiteId = ut.universiteId
      WHERE ut.kullaniciId = $1
    `,
      [kullaniciId]
    );

    res.status(200).json({
      takipEdilenler: result.rows,
      toplam: result.rowCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const universiteTakipçileriGetir = async (req, res) => {
  const { universiteId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT k.kullaniciAdi
      FROM UniversiteTakip ut
      JOIN Kullanici k ON k.kullaniciId = ut.kullaniciId
      WHERE ut.universiteId = $1
    `,
      [universiteId]
    );

    res.status(200).json({
      takipciler: result.rows,
      toplam: result.rowCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

module.exports = {
  takipEt,
  takiptenCik,
  takipDurumu,
  getirTakipEdilenler,
  universiteTakipçileriGetir,
};
