const pool = require("../config/db");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const kullaniciSorulariGetir = async (req, res) => {
  const kullaniciId = req.user.kullaniciId;

  const query = `
    SELECT 
      s.soruId, 
      s.icerik, 
      s.olusturmaTarihi,
      u.ad AS universiteAd,
      b.ad AS bolumAd,
      ko.ad AS konuAd,
      COUNT(DISTINCT c.cevapId) AS cevapSayisi,
      COUNT(DISTINCT sb.begeniId) AS begeniSayisi
    FROM Soru s
    LEFT JOIN Universite u ON s.universiteId = u.universiteId
    LEFT JOIN Bolum b ON s.bolumId = b.bolumId
    LEFT JOIN Konu ko ON s.konuId = ko.konuId
    LEFT JOIN Cevap c ON s.soruId = c.soruId
    LEFT JOIN SoruBegeni sb ON s.soruId = sb.soruId
    WHERE s.soranId = $1
    GROUP BY 
      s.soruId, s.icerik, s.olusturmaTarihi,
      u.ad, b.ad, ko.ad
    ORDER BY s.olusturmaTarihi DESC
  `;

  try {
    const result = await pool.query(query, [kullaniciId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Sorular getirilemedi");
  }
};

const kullaniciCevaplariGetir = async (req, res) => {
  const kullaniciId = req.user.kullaniciId;

  const query = `
    SELECT 
      c.cevapId, 
      c.icerik AS cevapIcerik, 
      c.olusturmaTarihi AS cevapTarihi,
      s.soruId, 
      s.icerik AS soruIcerik,
      k.kullaniciAdi AS soranKullaniciAdi,
      COALESCE(SUM(CASE WHEN ct.tepki = 'Like' THEN 1 ELSE 0 END), 0) AS likeSayisi,
      COALESCE(SUM(CASE WHEN ct.tepki = 'Dislike' THEN 1 ELSE 0 END), 0) AS dislikeSayisi
    FROM Cevap c
    INNER JOIN Soru s ON c.soruId = s.soruId
    INNER JOIN Kullanici k ON s.soranId = k.kullaniciId
    LEFT JOIN CevapTepki ct ON ct.cevapId = c.cevapId
    WHERE c.cevaplayanId = $1
    GROUP BY c.cevapId, c.icerik, c.olusturmaTarihi, s.soruId, s.icerik, k.kullaniciAdi
    ORDER BY c.olusturmaTarihi DESC
  `;

  try {
    const result = await pool.query(query, [kullaniciId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Cevaplar getirilemedi");
  }
};

const kullaniciForumlariGetir = async (req, res) => {
  const kullaniciId = req.user.kullaniciId; // JWT'den gelen kullanıcı ID

  const query = `
    SELECT 
      f.forumId,
      f.baslik,
      f.olusturmaTarihi,
      u.ad AS universiteAd,
      COUNT(e.entryId) AS entrySayisi
    FROM Forum f
    LEFT JOIN Universite u ON f.universiteId = u.universiteId
    LEFT JOIN Entry e ON f.forumId = e.forumId
    WHERE f.olusturanId = $1
    GROUP BY f.forumId, f.baslik, f.olusturmaTarihi, u.ad
    ORDER BY f.olusturmaTarihi DESC
  `;

  try {
    const result = await pool.query(query, [kullaniciId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Forumlar getirilemedi:", err);
    res.status(500).send("Forumlar getirilemedi");
  }
};

const kullaniciEntryleriGetir = async (req, res) => {
  const kullaniciId = req.user.kullaniciId;

  const query = `
    SELECT 
      e.entryId,
      e.forumId,
      f.baslik AS forumBaslik,
      e.icerik,
      e.olusturmaTarihi,
      COUNT(CASE WHEN et.tepki = 'Like' THEN 1 END) AS likeSayisi,
      COUNT(CASE WHEN et.tepki = 'Dislike' THEN 1 END) AS dislikeSayisi
    FROM Entry e
    INNER JOIN Forum f ON e.forumId = f.forumId
    LEFT JOIN EntryTepki et ON e.entryId = et.entryId
    WHERE e.kullaniciId = $1
    GROUP BY e.entryId, f.baslik, e.forumId, e.icerik, e.olusturmaTarihi
    ORDER BY e.olusturmaTarihi DESC
  `;

  try {
    const result = await pool.query(query, [kullaniciId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Entryler alınırken hata:", err);
    res.status(500).send("Kullanıcının entry'leri getirilemedi.");
  }
};

const begenilenSorulariGetir = async (req, res) => {
  const kullaniciId = req.user.kullaniciId;

  const query = `
    SELECT 
      s.soruId,
      s.icerik,
      s.olusturmaTarihi,
      k.kullaniciId,
      k.kullaniciAdi AS kullaniciAdi,
      u.ad AS universiteAd,
      b.ad AS bolumAd,
      ko.ad AS konuAd,
      COUNT(DISTINCT c.cevapId) AS cevapSayisi,
      COUNT(DISTINCT sb2.begeniId) AS begeniSayisi
    FROM SoruBegeni sb
    INNER JOIN Soru s ON sb.soruId = s.soruId
    LEFT JOIN Kullanici k ON s.soranId = k.kullaniciId
    LEFT JOIN Universite u ON s.universiteId = u.universiteId
    LEFT JOIN Bolum b ON s.bolumId = b.bolumId
    LEFT JOIN Konu ko ON s.konuId = ko.konuId
    LEFT JOIN Cevap c ON s.soruId = c.soruId
    LEFT JOIN SoruBegeni sb2 ON s.soruId = sb2.soruId
    WHERE sb.kullaniciId = $1
    GROUP BY 
      s.soruId, s.icerik, s.olusturmaTarihi,
      k.kullaniciId, k.kullaniciAdi,
      u.ad, b.ad, ko.ad
    ORDER BY s.olusturmaTarihi DESC
  `;

  try {
    const result = await pool.query(query, [kullaniciId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Beğenilen sorular getirilemedi");
  }
};

const profilGuncelle = async (req, res) => {
  const kullaniciId = req.user.kullaniciId;
  const { ad, soyad, sifre, kullaniciAdi, aktifMi } = req.body;

  try {
    let updateQuery;
    let params;

    // Şifre gönderildi mi kontrol et
    if (sifre) {
      // Şifre gönderildiyse hash'le ve tüm alanları güncelle
      const hashedPassword = await bcrypt.hash(sifre, 10);
      
      updateQuery = `UPDATE Kullanici SET 
         ad = $1,
         soyad = $2,
         sifre = $3,
         kullaniciAdi = $4,
         aktifMi = $5
       WHERE kullaniciId = $6
       RETURNING kullaniciId, ad, soyad, kullaniciAdi, aktifMi`;
      
      params = [ad, soyad, hashedPassword, kullaniciAdi, aktifMi, kullaniciId];
    } else {
      // Şifre gönderilmediyse sadece diğer alanları güncelle
      updateQuery = `UPDATE Kullanici SET 
         ad = $1,
         soyad = $2,
         kullaniciAdi = $3,
         aktifMi = $4
       WHERE kullaniciId = $5
       RETURNING kullaniciId, ad, soyad, kullaniciAdi, aktifMi`;
      
      params = [ad, soyad, kullaniciAdi, aktifMi, kullaniciId];
    }

    const sonuc = await pool.query(updateQuery, params);

    res.json({ mesaj: "Güncelleme başarılı", kullanici: sonuc.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mesaj: "Güncelleme başarısız" });
  }
};

const olusturdugumGruplar = async (req, res) => {
  const kullaniciId = req.user.kullaniciId;

  try {
    const gruplar = await pool.query(
      `SELECT 
         g.grupId,
         g.ad,
         g.olusturmaTarihi,
         COUNT(gu.uyeId) AS uyeSayisi
       FROM 
         Grup g
       LEFT JOIN 
         GrupUye gu ON g.grupId = gu.grupId
       WHERE 
         g.olusturanId = $1
       GROUP BY 
         g.grupId
       ORDER BY 
         g.olusturmaTarihi DESC`,
      [kullaniciId]
    );

    return res.status(200).json({ gruplar: gruplar.rows });
  } catch (error) {
    console.error("Oluşturulan grupları listeleme hatası:", error);
    return res.status(500).json({ hata: "Sunucu hatası" });
  }
};

const begenilenEntryleriGetir = async (req, res, next) => {
  const kullaniciId = req.user.kullaniciId; // JWT ile gelen kullanıcı ID

  const query = `
    SELECT 
        e.entryId,
        e.icerik AS entryIcerik,
        e.olusturmaTarihi AS entryTarihi,

        f.forumId,
        f.baslik AS forumBaslik,
        forumOwner.kullaniciId AS forumSahibiId,
        forumOwner.kullaniciAdi AS forumSahibiAdi,

        entryOwner.kullaniciId AS entrySahibiId,
        entryOwner.kullaniciAdi AS entrySahibiAdi,

        COALESCE(likeCount.like_sayisi, 0) AS likeSayisi,
        COALESCE(dislikeCount.dislike_sayisi, 0) AS dislikeSayisi

    FROM EntryTepki et
    JOIN Entry e ON e.entryId = et.entryId
    JOIN Forum f ON f.forumId = e.forumId
    JOIN Kullanici entryOwner ON entryOwner.kullaniciId = e.kullaniciId
    JOIN Kullanici forumOwner ON forumOwner.kullaniciId = f.olusturanId

    LEFT JOIN (
        SELECT entryId, COUNT(*) AS like_sayisi
        FROM EntryTepki
        WHERE tepki = 'Like'
        GROUP BY entryId
    ) AS likeCount ON likeCount.entryId = e.entryId

    LEFT JOIN (
        SELECT entryId, COUNT(*) AS dislike_sayisi
        FROM EntryTepki
        WHERE tepki = 'Dislike'
        GROUP BY entryId
    ) AS dislikeCount ON dislikeCount.entryId = e.entryId

    WHERE et.kullaniciId = $1 AND et.tepki = 'Like';
  `;

  try {
    const { rows } = await pool.query(query, [kullaniciId]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const begenilenCevaplariGetir = async (req, res) => {
  try {
    const kullaniciId = req.user.kullaniciId;

    const query = `
      SELECT 
        c.cevapId,
        c.icerik AS "cevapIcerik",
        c.olusturmaTarihi AS "cevapTarihi",
        s.soruId,
        s.icerik AS "soruIcerik",
        s.soranId,
        ks.kullaniciAdi AS "soranKullaniciAdi",
        c.cevaplayanId,
        kc.kullaniciAdi AS "cevaplayanKullaniciAdi",
        COALESCE(like_count.count, 0) AS "likeSayisi",
        COALESCE(dislike_count.count, 0) AS "dislikeSayisi"
      FROM CevapTepki ct
      JOIN Cevap c ON ct.cevapId = c.cevapId
      JOIN Soru s ON c.soruId = s.soruId
      JOIN Kullanici ks ON s.soranId = ks.kullaniciId
      JOIN Kullanici kc ON c.cevaplayanId = kc.kullaniciId
      LEFT JOIN (
        SELECT cevapId, COUNT(*) as count
        FROM CevapTepki
        WHERE tepki = 'Like'
        GROUP BY cevapId
      ) like_count ON c.cevapId = like_count.cevapId
      LEFT JOIN (
        SELECT cevapId, COUNT(*) as count
        FROM CevapTepki
        WHERE tepki = 'Dislike'
        GROUP BY cevapId
      ) dislike_count ON c.cevapId = dislike_count.cevapId
      WHERE ct.kullaniciId = $1 AND ct.tepki = 'Like'
      ORDER BY c.olusturmaTarihi DESC
    `;

    const { rows } = await pool.query(query, [kullaniciId]);
    res.json(rows);
  } catch (err) {
    console.error("Beğenilen cevapları çekerken hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

module.exports = {
  profilGuncelle,
  kullaniciSorulariGetir,
  kullaniciForumlariGetir,
  kullaniciEntryleriGetir,
  kullaniciCevaplariGetir,
  begenilenSorulariGetir,
  olusturdugumGruplar,
  begenilenEntryleriGetir,
  begenilenCevaplariGetir,
};