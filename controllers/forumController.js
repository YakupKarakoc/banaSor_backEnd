const pool = require("../config/db");

const forumEkle = async (req, res) => {
  const { baslik, universiteId } = req.body;
  const olusturanId = req.user.kullaniciId; // Kullanıcı ID'si, JWT'den alınır

  const istanbulTime = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Istanbul",
  });

  try {
    const result = await pool.query(
      `INSERT INTO Forum (olusturanId, baslik, universiteId, olusturmaTarihi)
         VALUES ($1, $2, $3, $4) 
         RETURNING *`, // Forum bilgilerini döndürüyoruz
      [olusturanId, baslik, universiteId, istanbulTime]
    );

    res.status(201).json(result.rows[0]); // Forum detaylarını döndürüyoruz
  } catch (err) {
    console.error(err);
    res.status(500).send("Forum oluşturulamadı"); // Hata mesajı
  }
};

const forumGuncelle = async (req, res) => {
  const { forumId, yeniBaslik } = req.body;
  const kullaniciId = req.user.kullaniciId;

  try {
    // Forumun sahibine ait mi kontrolü
    const forum = await pool.query(
      `SELECT * FROM Forum WHERE forumId = $1 AND olusturanId = $2`,
      [forumId, kullaniciId]
    );

    if (forum.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Bu foruma başlık güncelleme yetkiniz yok." });
    }

    // Başlığı güncelle
    const result = await pool.query(
      `UPDATE Forum SET baslik = $1 WHERE forumId = $2 RETURNING *`,
      [yeniBaslik, forumId]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Forum başlığı güncellenemedi");
  }
};

const forumSil = async (req, res) => {
  const { forumId } = req.body;
  const kullaniciId = req.user.kullaniciId;

  try {
    // Forum sahibini kontrol et
    const forum = await pool.query(`SELECT * FROM Forum WHERE forumId = $1`, [
      forumId,
    ]);

    if (forum.rows.length === 0) {
      return res.status(404).send("Forum bulunamadı.");
    }

    if (forum.rows[0].olusturanid !== kullaniciId) {
      return res.status(403).send("Bu forumu silme yetkiniz yok.");
    }

    await pool.query(`DELETE FROM Forum WHERE forumId = $1`, [forumId]);

    res.status(200).send("Forum başarıyla silindi.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Forum silinemedi.");
  }
};

const entryEkle = async (req, res) => {
  const { forumId, icerik } = req.body;
  const kullaniciId = req.user.kullaniciId;

  const istanbulTime = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Istanbul",
  });

  try {
    const result = await pool.query(
      `INSERT INTO Entry (forumId, kullaniciId, icerik, olusturmaTarihi)
           VALUES ($1, $2, $3, $4) 
           RETURNING *`,
      [forumId, kullaniciId, icerik, istanbulTime]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Entry eklenemedi");
  }
};

const entryGuncelle = async (req, res) => {
  const { entryId, yeniIcerik } = req.body;
  const kullaniciId = req.user.kullaniciId;

  try {
    // Entry sahibine ait mi kontrolü
    const entry = await pool.query(
      `SELECT * FROM Entry WHERE entryId = $1 AND kullaniciId = $2`,
      [entryId, kullaniciId]
    );

    if (entry.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Bu entry'i güncelleme yetkiniz yok." });
    }

    // İçeriği güncelle
    const result = await pool.query(
      `UPDATE Entry SET icerik = $1 WHERE entryId = $2 RETURNING *`,
      [yeniIcerik, entryId]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Entry içeriği güncellenemedi");
  }
};

const entrySil = async (req, res) => {
  const { entryId } = req.body;
  const kullaniciId = req.user.kullaniciId;

  try {
    // Entry sahibini kontrol et
    const entry = await pool.query(`SELECT * FROM Entry WHERE entryId = $1`, [
      entryId,
    ]);

    if (entry.rows.length === 0) {
      return res.status(404).send("Entry bulunamadı.");
    }

    if (entry.rows[0].kullaniciid !== kullaniciId) {
      return res.status(403).send("Bu entry'yi silme yetkiniz yok.");
    }

    await pool.query(`DELETE FROM Entry WHERE entryId = $1`, [entryId]);

    res.status(200).send("Entry başarıyla silindi.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Entry silinemedi.");
  }
};

const forumlariGetir = async (req, res) => {
  const { universiteId } = req.query; // Filtreleme için query parametre kullanıyoruz

  try {
    let query = `SELECT 
  forumId,
  baslik,
  k.kullaniciAdi AS "olusturanKullaniciAdi",
  u.ad AS "universiteAdi",
  (SELECT COUNT(*) FROM Entry e WHERE e.forumId = f.forumId) AS "entrySayisi",
  (f.olusturmaTarihi AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Istanbul') AS "olusturmaTarihi"
FROM Forum f
JOIN Kullanici k ON f.olusturanId = k.kullaniciId
JOIN Universite u ON f.universiteId = u.universiteId
`;

    const params = [];

    if (universiteId) {
      query += ` WHERE f.universiteId = $1 `;
      params.push(universiteId);
    }

    query += `
      GROUP BY f.forumId, f.baslik, k.kullaniciAdi, u.ad, f.olusturmaTarihi
      ORDER BY f.olusturmaTarihi DESC
    `;

    const result = await pool.query(query, params);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Forumlar getirilemedi");
  }
};

const universiteForumGetir = async (req, res) => {
  const { universiteId } = req.query;

  // universiteId zorunlu hale getirildi
  if (!universiteId) {
    return res.status(400).send("Üniversite ID gereklidir.");
  }

  const query = `
    SELECT 
      f.forumId,
      f.baslik,
      (f.olusturmaTarihi AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Istanbul') AS "olusturmaTarihi",
      k.kullaniciId,
      k.kullaniciAdi AS "kullaniciAdi",
      u.ad AS "universiteAd",
      COUNT(DISTINCT e.entryId) AS "entrySayisi"
    FROM Forum f
    LEFT JOIN Kullanici k ON f.olusturanId = k.kullaniciId
    LEFT JOIN Universite u ON f.universiteId = u.universiteId
    LEFT JOIN Entry e ON f.forumId = e.forumId
    WHERE f.universiteId = $1
    GROUP BY 
      f.forumId, f.baslik, f.olusturmaTarihi,
      k.kullaniciId, k.kullaniciAdi,
      u.ad
    ORDER BY f.olusturmaTarihi DESC
  `;

  try {
    const result = await pool.query(query, [universiteId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Forumlar getirilemedi");
  }
};

module.exports = {
  forumEkle,
  forumGuncelle,
  forumSil,
  entryEkle,
  entryGuncelle,
  entrySil,
  forumlariGetir,
  universiteForumGetir,
};
