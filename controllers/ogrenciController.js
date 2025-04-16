const pool = require("../config/db");

// Öğrenci kaydetme controller fonksiyonu (auth ile)
const ogrenciKaydet = async (req, res) => {
  const { universiteId, bolumId } = req.body;
  const kullaniciId = req.user?.kullaniciId; // Auth middleware'den gelen kullanıcı bilgisi

  try {
    if (!kullaniciId) {
      return res.status(401).json({ error: "Yetkisiz erişim." });
    }

    // 1. Kullanıcı türü kontrolü
    const kullanici = await pool.query(
      `SELECT kullaniciTuruId FROM Kullanici WHERE kullaniciId = $1`,
      [kullaniciId]
    );

    if (kullanici.rowCount === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    if (kullanici.rows[0].kullanicituruid !== 2) {
      return res
        .status(403)
        .json({ error: "Sadece üniversite öğrencileri kayıt yapabilir." });
    }

    // 2. Bölüm, fakülte ve üniversite aktiflik kontrolü
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

    // 3. Öğrenci daha önce kayıt olmuş mu?
    const mevcut = await pool.query(
      `SELECT * FROM Ogrenci WHERE kullaniciId = $1`,
      [kullaniciId]
    );

    if (mevcut.rowCount > 0) {
      return res
        .status(400)
        .json({ error: "Kullanıcı zaten öğrenci olarak kayıtlı." });
    }

    // 4. Kaydet
    const kayit = await pool.query(
      `INSERT INTO Ogrenci (kullaniciId, universiteId, bolumId)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [kullaniciId, universiteId, bolumId]
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
  ogrenciKaydet,
};
