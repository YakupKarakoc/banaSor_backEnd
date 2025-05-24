const pool = require("../config/db");

const forumEkle = async (req, res) => {
  const { baslik, universiteId } = req.body;
  const olusturanId = req.user.kullaniciId;

  const istanbulTime = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Istanbul",
  });

  try {
    // Kullanıcının aktif olup olmadığını kontrol et
    const kullanici = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciId = $1 AND aktifMi = true",
      [olusturanId]
    );

    if (kullanici.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Aktif olmayan kullanıcılar işlem yapamaz" });
    }

    // Forum ekleme işlemi
    const result = await pool.query(
      `INSERT INTO Forum (olusturanId, baslik, universiteId, olusturmaTarihi)
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
      [olusturanId, baslik, universiteId, istanbulTime]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Forum oluşturulamadı");
  }
};

const forumGuncelle = async (req, res) => {
  const { forumId, yeniBaslik } = req.body;
  const kullaniciId = req.user.kullaniciId;

  try {
    // Kullanıcının aktif olup olmadığını kontrol et
    const kullanici = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciId = $1 AND aktifMi = true",
      [kullaniciId]
    );

    if (kullanici.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Aktif olmayan kullanıcılar işlem yapamaz" });
    }

    const entryKontrol = await pool.query(
      "SELECT 1 FROM Entry WHERE forumId = $1 LIMIT 1",
      [forumId]
    );

    if (entryKontrol.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Bu foruma entry girildiği için güncellenemez" });
    }

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
    // Kullanıcı aktif mi kontrol et
    const kullanici = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciId = $1 AND aktifMi = true",
      [kullaniciId]
    );

    if (kullanici.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Aktif olmayan kullanıcılar işlem yapamaz" });
    }

    // Forum sahibini kontrol et
    const forum = await pool.query("SELECT * FROM Forum WHERE forumId = $1", [
      forumId,
    ]);

    if (forum.rows.length === 0) {
      return res.status(404).send("Forum bulunamadı.");
    }

    if (forum.rows[0].olusturanid !== kullaniciId) {
      return res.status(403).send("Bu forumu silme yetkiniz yok.");
    }

    const entryKontrol = await pool.query(
      "SELECT 1 FROM Entry WHERE forumId = $1 LIMIT 1",
      [forumId]
    );

    if (entryKontrol.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Bu foruma entry girildiği için silinemez" });
    }

    await pool.query("DELETE FROM Forum WHERE forumId = $1", [forumId]);

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
    // Kullanıcının aktif olup olmadığını kontrol et
    const kullanici = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciId = $1 AND aktifMi = true",
      [kullaniciId]
    );

    if (kullanici.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Aktif olmayan kullanıcılar işlem yapamaz" });
    }

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
    // Kullanıcının aktif olup olmadığını kontrol et
    const kullanici = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciId = $1 AND aktifMi = true",
      [kullaniciId]
    );

    if (kullanici.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Aktif olmayan kullanıcılar işlem yapamaz" });
    }

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
    // Kullanıcının aktif olup olmadığını kontrol et
    const kullanici = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciId = $1 AND aktifMi = true",
      [kullaniciId]
    );

    if (kullanici.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Aktif olmayan kullanıcılar işlem yapamaz" });
    }

    // Entry sahibini kontrol et
    const entry = await pool.query(`SELECT * FROM Entry WHERE entryId = $1`, [
      entryId,
    ]);

    if (entry.rows.length === 0) {
      return res.status(404).send("Entry bulunamadı.");
    }

    // Entry sahibinin kim olduğunu kontrol et
    if (entry.rows[0].kullaniciid !== kullaniciId) {
      return res.status(403).send("Bu entry'yi silme yetkiniz yok.");
    }

    // Entry'yi sil
    await pool.query(`DELETE FROM Entry WHERE entryId = $1`, [entryId]);

    res.status(200).send("Entry başarıyla silindi.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Entry silinemedi.");
  }
};

const forumDetayGetir = async (req, res) => {
  const { forumId } = req.params;

  const query = `
    SELECT 
      f.forumId,
      f.baslik,
      f.olusturmaTarihi,
      ku.kullaniciAdi AS olusturanKullaniciAdi,
      u.ad AS universite,

      e.entryId,
      e.icerik AS entryIcerik,
      e.olusturmaTarihi AS entryTarihi,
      ke.kullaniciAdi AS entryKullaniciAdi,

      COALESCE(SUM(CASE WHEN et.tepki = 'Like' THEN 1 ELSE 0 END), 0) AS likeSayisi,
      COALESCE(SUM(CASE WHEN et.tepki = 'Dislike' THEN 1 ELSE 0 END), 0) AS dislikeSayisi

    FROM Forum f
    LEFT JOIN Kullanici ku ON f.olusturanId = ku.kullaniciId
    LEFT JOIN Universite u ON f.universiteId = u.universiteId
    LEFT JOIN Entry e ON f.forumId = e.forumId
    LEFT JOIN Kullanici ke ON e.kullaniciId = ke.kullaniciId
    LEFT JOIN EntryTepki et ON e.entryId = et.entryId

    WHERE f.forumId = $1

    GROUP BY 
      f.forumId, f.baslik, f.olusturmaTarihi,
      ku.kullaniciAdi, u.ad,
      e.entryId, e.icerik, e.olusturmaTarihi, ke.kullaniciAdi

    ORDER BY e.olusturmaTarihi ASC
  `;

  try {
    const result = await pool.query(query, [forumId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Forum bulunamadı" });
    }

    const ilk = result.rows[0];

    const response = {
      forumId: ilk.forumid,
      baslik: ilk.baslik,
      olusturmaTarihi: ilk.olusturmatarihi,
      olusturanKullaniciAdi: ilk.olusturankullaniciadi,
      universite: ilk.universite,
      entrySayisi: result.rows.filter((row) => row.entryid !== null).length,
      entryler: result.rows
        .filter((row) => row.entryid !== null)
        .map((row) => ({
          entryId: row.entryid,
          icerik: row.entryicerik,
          olusturmaTarihi: row.entrytarihi,
          kullaniciAdi: row.entrykullaniciadi,
          likeSayisi: parseInt(row.likesayisi, 10),
          dislikeSayisi: parseInt(row.dislikesayisi, 10),
        })),
    };

    res.json(response);
  } catch (err) {
    console.error("Forum detayları alınırken hata:", err);
    res.status(500).send("Forum detayları getirilemedi.");
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

const entryTepkiEkleGuncelle = async (req, res) => {
  const kullaniciId = req.user.kullaniciId;
  const { entryId, tepki } = req.body;

  const validTepkiler = ["Like", "Dislike"];
  if (!validTepkiler.includes(tepki)) {
    return res.status(400).json({ message: "Geçersiz tepki türü" });
  }

  // İstanbul saatine göre tarih
  const istanbulTime = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Istanbul",
  });

  try {
    // Kullanıcı aktif mi kontrol et
    const kullanici = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciId = $1 AND aktifMi = true",
      [kullaniciId]
    );

    if (kullanici.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Aktif olmayan kullanıcılar işlem yapamaz" });
    }

    // Entry sahibini bul
    const entrySahibiQuery = await pool.query(
      "SELECT kullaniciId FROM Entry WHERE entryId = $1",
      [entryId]
    );
    if (entrySahibiQuery.rows.length === 0) {
      return res.status(404).json({ message: "Entry bulunamadı" });
    }
    const entrySahibiId = entrySahibiQuery.rows[0].kullaniciid;

    const existing = await pool.query(
      "SELECT tepki FROM EntryTepki WHERE entryId = $1 AND kullaniciId = $2",
      [entryId, kullaniciId]
    );

    if (existing.rows.length === 0) {
      // İlk kez tepki veriliyor
      await pool.query(
        "INSERT INTO EntryTepki (entryId, kullaniciId, tepki, tarih) VALUES ($1, $2, $3, $4)",
        [entryId, kullaniciId, tepki, istanbulTime]
      );

      if (tepki === "Like") {
        await pool.query(
          "UPDATE Kullanici SET puan = puan + 5 WHERE kullaniciId = $1",
          [entrySahibiId]
        );
      }

      return res.json({ message: "Tepki eklendi" });
    }

    const mevcutTepki = existing.rows[0].tepki;

    if (mevcutTepki === tepki) {
      // Aynı tepkiye tekrar basıldı → geri çek
      await pool.query(
        "DELETE FROM EntryTepki WHERE entryId = $1 AND kullaniciId = $2",
        [entryId, kullaniciId]
      );

      if (tepki === "Like") {
        await pool.query(
          "UPDATE Kullanici SET puan = puan - 5 WHERE kullaniciId = $1",
          [entrySahibiId]
        );
      }

      return res.json({ message: "Tepki geri çekildi" });
    } else {
      // Tepki değiştiriliyor
      await pool.query(
        "UPDATE EntryTepki SET tepki = $1, tarih = $2 WHERE entryId = $3 AND kullaniciId = $4",
        [tepki, istanbulTime, entryId, kullaniciId]
      );

      if (mevcutTepki === "Like" && tepki === "Dislike") {
        await pool.query(
          "UPDATE Kullanici SET puan = puan - 5 WHERE kullaniciId = $1",
          [entrySahibiId]
        );
      } else if (mevcutTepki === "Dislike" && tepki === "Like") {
        await pool.query(
          "UPDATE Kullanici SET puan = puan + 5 WHERE kullaniciId = $1",
          [entrySahibiId]
        );
      }

      return res.json({ message: "Tepki güncellendi" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Tepki işlemi başarısız");
  }
};

const entryTepkisi = async (req, res) => {
  const kullaniciId = req.user.kullaniciId;
  const entryId = req.params.entryId;

  try {
    // Entry var mı kontrolü
    const entry = await pool.query(
      "SELECT entryId FROM Entry WHERE entryId = $1",
      [entryId]
    );

    if (entry.rows.length === 0) {
      return res.status(404).json({ message: "Entry bulunamadı" });
    }

    // Tepki sorgusu
    const tepkiQuery = await pool.query(
      "SELECT tepki FROM EntryTepki WHERE entryId = $1 AND kullaniciId = $2",
      [entryId, kullaniciId]
    );

    const tepki = tepkiQuery.rows.length > 0 ? tepkiQuery.rows[0].tepki : null;

    return res.json({ tepki }); // "Like", "Dislike" ya da null
  } catch (err) {
    console.error(err);
    res.status(500).send("Tepki sorgusu başarısız");
  }
};

module.exports = {
  forumEkle,
  forumGuncelle,
  forumSil,
  entryEkle,
  entryGuncelle,
  entrySil,
  forumDetayGetir,
  forumlariGetir,
  universiteForumGetir,
  entryTepkiEkleGuncelle,
  entryTepkisi,
};
