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

module.exports = {
  forumEkle,
  forumGuncelle,
  forumSil,
  entryEkle,
  entryGuncelle,
  entrySil,
};
