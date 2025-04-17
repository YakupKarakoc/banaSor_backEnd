const pool = require("../config/db");

// Email ile öğrenci kaydetme (auth olmadan)
const ogrenciKaydetEmail = async (req, res) => {
  const { email, universiteId, bolumId } = req.body;

  try {
    if (!email || !universiteId || !bolumId) {
      return res
        .status(400)
        .json({ error: "Email, üniversite ve bölüm bilgileri gereklidir." });
    }

    // 1. Kullanıcı var mı kontrolü
    const kullanici = await pool.query(
      `SELECT kullaniciId, kullaniciTuruId FROM Kullanici WHERE email = $1`,
      [email]
    );

    if (kullanici.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "E-posta adresi ile eşleşen kullanıcı bulunamadı." });
    }

    const { kullaniciid, kullanicituruid } = kullanici.rows[0];

    if (kullanicituruid !== 2) {
      return res
        .status(403)
        .json({ error: "Sadece üniversite öğrencileri kayıt olabilir." });
    }

    // 2. Bölüm, fakülte ve üniversite aktif mi?
    const bolum = await pool.query(
      `SELECT b.aktifMi AS bolumAktif, f.aktifMi AS fakulteAktif, u.aktifMi AS universiteAktif
       FROM Bolum b
       JOIN Fakulte f ON b.fakulteId = f.fakulteId
       JOIN Universite u ON b.universiteId = u.universiteId
       WHERE b.bolumId = $1`,
      [bolumId]
    );

    if (bolum.rowCount === 0) {
      return res.status(404).json({ error: "Bölüm bulunamadı." });
    }

    const { bolumaktif, fakulteaktif, universiteaktif } = bolum.rows[0];

    if (!bolumaktif || !fakulteaktif || !universiteaktif) {
      return res
        .status(400)
        .json({ error: "Seçilen üniversite, fakülte veya bölüm aktif değil." });
    }

    // 3. Zaten öğrenci mi?
    const mevcut = await pool.query(
      `SELECT * FROM Ogrenci WHERE kullaniciId = $1`,
      [kullaniciid]
    );

    if (mevcut.rowCount > 0) {
      return res
        .status(400)
        .json({ error: "Bu e-posta ile kayıtlı kullanıcı zaten öğrenci." });
    }

    // 4. Kaydet
    const kayit = await pool.query(
      `INSERT INTO Ogrenci (kullaniciId, universiteId, bolumId)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [kullaniciid, universiteId, bolumId]
    );

    res.status(201).json({
      message: "Öğrenci başarıyla kaydedildi.",
      ogrenci: kayit.rows[0],
    });
  } catch (err) {
    console.error("Kayıt hatası:", err);
    res.status(500).json({ error: "Sunucu hatası. Kayıt yapılamadı." });
  }
};

module.exports = {
  ogrenciKaydetEmail,
};
