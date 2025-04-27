const pool = require("../config/db");

const konulariGetir = async (req, res) => {
  const { arama } = req.query;
  let query = "SELECT * FROM Konu WHERE 1=1";
  const values = [];

  if (arama) {
    values.push(`%${arama}%`);
    query += ` AND LOWER(ad) LIKE LOWER($${values.length})`;
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Konular getirilemedi");
  }
};

const soruEkle = async (req, res) => {
  const { universiteId, bolumId, konuId, icerik } = req.body;
  const soranId = req.user.kullaniciId;

  const istanbulTime = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Istanbul",
  });

  try {
    const result = await pool.query(
      `INSERT INTO Soru (soranId, universiteId, bolumId, konuId, icerik, olusturmaTarihi)
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
      [soranId, universiteId, bolumId, konuId, icerik, istanbulTime]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Soru eklenemedi");
  }
};

// ✅ Soru içeriğini güncelle – sadece kendi sorusunu
const soruGuncelle = async (req, res) => {
  const soruId = req.params.id;
  const { icerik } = req.body;
  const userId = req.user.kullaniciId;

  try {
    // Yetki kontrolü
    const kontrol = await pool.query(
      "SELECT * FROM Soru WHERE soruId = $1 AND soranId = $2",
      [soruId, userId]
    );

    if (kontrol.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Bu soruyu güncelleme yetkiniz yok" });
    }

    const result = await pool.query(
      "UPDATE Soru SET icerik = $1 WHERE soruId = $2 RETURNING *",
      [icerik, soruId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Soru güncellenemedi");
  }
};

// ✅ Soru sil – sadece kendi sorusunu silebilsin
const soruSil = async (req, res) => {
  const soruId = req.params.id;
  const userId = req.user.kullaniciId;

  try {
    const kontrol = await pool.query(
      "SELECT * FROM Soru WHERE soruId = $1 AND soranId = $2",
      [soruId, userId]
    );

    if (kontrol.rows.length === 0) {
      return res.status(403).json({ message: "Bu soruyu silme yetkiniz yok" });
    }

    await pool.query("DELETE FROM Soru WHERE soruId = $1", [soruId]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Soru silinemedi");
  }
};

// Cevap ekle
const cevapEkle = async (req, res) => {
  const { soruId, icerik } = req.body;
  const cevaplayanId = req.user.kullaniciId;

  // İstanbul saatine göre tarih almak
  const istanbulTime = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Istanbul",
  });

  try {
    const result = await pool.query(
      `INSERT INTO Cevap (soruId, cevaplayanId, icerik, olusturmaTarihi)
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
      [soruId, cevaplayanId, icerik, istanbulTime]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Cevap eklenemedi");
  }
};

const cevapGuncelle = async (req, res) => {
  const cevapId = req.params.id;
  const { icerik } = req.body;
  const userId = req.user.kullaniciId;

  try {
    const kontrol = await pool.query(
      "SELECT * FROM Cevap WHERE cevapId = $1 AND cevaplayanId = $2",
      [cevapId, userId]
    );

    if (kontrol.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Bu cevabı güncelleme yetkiniz yok" });
    }

    const result = await pool.query(
      "UPDATE Cevap SET icerik = $1 WHERE cevapId = $2 RETURNING *",
      [icerik, cevapId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Cevap güncellenemedi");
  }
};

// ✅ Cevap sil – sadece kendi cevabını silebilsin
const cevapSil = async (req, res) => {
  const cevapId = req.params.id;
  const userId = req.user.kullaniciId;

  try {
    const kontrol = await pool.query(
      "SELECT * FROM Cevap WHERE cevapId = $1 AND cevaplayanId = $2",
      [cevapId, userId]
    );

    if (kontrol.rows.length === 0) {
      return res.status(403).json({ message: "Bu cevabı silme yetkiniz yok" });
    }

    await pool.query("DELETE FROM Cevap WHERE cevapId = $1", [cevapId]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Cevap silinemedi");
  }
};

// ✅ Soru filtreleme – auth olmadan da erişilebilir
const sorulariGetir = async (req, res) => {
  const { universiteId, bolumId, konuId } = req.query;

  let query = `
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
      COUNT(DISTINCT sb.begeniId) AS begeniSayisi
    FROM Soru s
    LEFT JOIN Kullanici k ON s.soranId = k.kullaniciId
    LEFT JOIN Universite u ON s.universiteId = u.universiteId
    LEFT JOIN Bolum b ON s.bolumId = b.bolumId
    LEFT JOIN Konu ko ON s.konuId = ko.konuId
    LEFT JOIN Cevap c ON s.soruId = c.soruId
    LEFT JOIN SoruBegeni sb ON s.soruId = sb.soruId
    WHERE 1=1
  `;

  const values = [];

  if (universiteId) {
    values.push(universiteId);
    query += ` AND s.universiteId = $${values.length}`;
  }
  if (bolumId) {
    values.push(bolumId);
    query += ` AND s.bolumId = $${values.length}`;
  }
  if (konuId) {
    values.push(konuId);
    query += ` AND s.konuId = $${values.length}`;
  }

  query += `
    GROUP BY 
      s.soruId, s.icerik, s.olusturmaTarihi,
      k.kullaniciId, k.kullaniciAdi,
      u.ad, b.ad, ko.ad
    ORDER BY s.olusturmaTarihi DESC
  `;

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Sorular getirilemedi");
  }
};

const soruDetayGetir = async (req, res) => {
  const { soruId } = req.params;

  const query = `
    SELECT 
      s.soruId, s.icerik AS soruIcerik, s.olusturmaTarihi, 
      ku.kullaniciAdi AS soranKullaniciAdi,
      k.ad AS konu, u.ad AS universite, b.ad AS bolum,

      c.cevapId, c.icerik AS cevapIcerik, c.olusturmaTarihi AS cevapTarihi,
      kc.kullaniciAdi AS cevaplayanKullaniciAdi,

      -- Cevap için like ve dislike sayıları
      COALESCE(SUM(CASE WHEN ct.tepki = 'Like' THEN 1 ELSE 0 END), 0) AS likeSayisi,
      COALESCE(SUM(CASE WHEN ct.tepki = 'Dislike' THEN 1 ELSE 0 END), 0) AS dislikeSayisi,

      -- Soruya toplam beğeni
      (SELECT COUNT(*) FROM SoruBegeni sb WHERE sb.soruId = s.soruId) AS soruBegeniSayisi

    FROM Soru s
    LEFT JOIN Kullanici ku ON s.soranId = ku.kullaniciId
    LEFT JOIN Konu k ON s.konuId = k.konuId
    LEFT JOIN Universite u ON s.universiteId = u.universiteId
    LEFT JOIN Bolum b ON s.bolumId = b.bolumId
    LEFT JOIN Cevap c ON s.soruId = c.soruId
    LEFT JOIN Kullanici kc ON c.cevaplayanId = kc.kullaniciId
    LEFT JOIN CevapTepki ct ON c.cevapId = ct.cevapId

    WHERE s.soruId = $1

    GROUP BY 
      s.soruId, s.icerik, s.olusturmaTarihi,
      ku.kullaniciAdi, k.ad, u.ad, b.ad,
      c.cevapId, c.icerik, c.olusturmaTarihi, kc.kullaniciAdi
    ORDER BY c.olusturmaTarihi ASC
  `;

  try {
    const result = await pool.query(query, [soruId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Soru bulunamadı" });
    }

    const ilk = result.rows[0];

    const response = {
      soruId: ilk.soruid,
      icerik: ilk.soruicerik,
      olusturmaTarihi: ilk.olusturmatarihi,
      soranKullaniciAdi: ilk.sorankullaniciadi,
      konu: ilk.konu,
      universite: ilk.universite,
      bolum: ilk.bolum,
      begeniSayisi: parseInt(ilk.sorubegenisayisi, 10),
      cevaplar: result.rows
        .filter((row) => row.cevapid !== null)
        .map((row) => ({
          cevapId: row.cevapid,
          icerik: row.cevapicerik,
          olusturmaTarihi: row.cevaptarihi,
          cevaplayanKullaniciAdi: row.cevaplayankullaniciadi,
          likeSayisi: parseInt(row.likesayisi, 10),
          dislikeSayisi: parseInt(row.dislikesayisi, 10),
        })),
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send("Soru detayları getirilemedi");
  }
};

//Frontend’de kullanıcı aynı butona tekrar basarsa geri çekme (delete), diğerine basarsa değiştirme (update) olacak şekilde entegre edilebilir.
const tepkiEkleGuncelle = async (req, res) => {
  const kullaniciId = req.user.kullaniciId;
  const { cevapId, tepki } = req.body;

  const validTepkiler = ["Like", "Dislike"];
  if (!validTepkiler.includes(tepki)) {
    return res.status(400).json({ message: "Geçersiz tepki türü" });
  }

  try {
    // Cevap sahibini bul
    const cevapSahibiQuery = await pool.query(
      "SELECT cevaplayanId FROM Cevap WHERE cevapId = $1",
      [cevapId]
    );
    if (cevapSahibiQuery.rows.length === 0) {
      return res.status(404).json({ message: "Cevap bulunamadı" });
    }
    const cevapSahibiId = cevapSahibiQuery.rows[0].cevaplayanid;

    const existing = await pool.query(
      "SELECT tepki FROM CevapTepki WHERE cevapId = $1 AND kullaniciId = $2",
      [cevapId, kullaniciId]
    );

    if (existing.rows.length === 0) {
      // İlk kez tepki veriliyor
      await pool.query(
        "INSERT INTO CevapTepki (cevapId, kullaniciId, tepki) VALUES ($1, $2, $3)",
        [cevapId, kullaniciId, tepki]
      );

      if (tepki === "Like") {
        await pool.query(
          "UPDATE Kullanici SET puan = puan + 5 WHERE kullaniciId = $1",
          [cevapSahibiId]
        );
      }

      return res.json({ message: "Tepki eklendi" });
    }

    const mevcutTepki = existing.rows[0].tepki;

    if (mevcutTepki === tepki) {
      // Aynı tepkiye tekrar basıldı → geri çek
      await pool.query(
        "DELETE FROM CevapTepki WHERE cevapId = $1 AND kullaniciId = $2",
        [cevapId, kullaniciId]
      );

      if (tepki === "Like") {
        await pool.query(
          "UPDATE Kullanici SET puan = puan - 5 WHERE kullaniciId = $1",
          [cevapSahibiId]
        );
      }

      return res.json({ message: "Tepki geri çekildi" });
    } else {
      // Tepki değiştiriliyor
      await pool.query(
        "UPDATE CevapTepki SET tepki = $1, tarih = CURRENT_TIMESTAMP WHERE cevapId = $2 AND kullaniciId = $3",
        [tepki, cevapId, kullaniciId]
      );

      if (mevcutTepki === "Like" && tepki === "Dislike") {
        // Like -> Dislike dönüşü: puanı -5 azalt
        await pool.query(
          "UPDATE Kullanici SET puan = puan - 5 WHERE kullaniciId = $1",
          [cevapSahibiId]
        );
      } else if (mevcutTepki === "Dislike" && tepki === "Like") {
        // Dislike -> Like dönüşü: puanı +5 artır
        await pool.query(
          "UPDATE Kullanici SET puan = puan + 5 WHERE kullaniciId = $1",
          [cevapSahibiId]
        );
      }

      return res.json({ message: "Tepki güncellendi" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Tepki işlemi başarısız");
  }
};

// SORU BEĞENİ
const soruBegen = async (req, res) => {
  const kullaniciId = req.user.kullaniciId;
  const { soruId } = req.body;

  try {
    const existing = await pool.query(
      "SELECT * FROM SoruBegeni WHERE soruId = $1 AND kullaniciId = $2",
      [soruId, kullaniciId]
    );

    // Soruyu soran kullanıcıyı bul
    const soru = await pool.query(
      "SELECT soranId FROM Soru WHERE soruId = $1",
      [soruId]
    );

    if (soru.rows.length === 0) {
      return res.status(404).json({ message: "Soru bulunamadı" });
    }

    const soranId = soru.rows[0].soranid;

    if (existing.rows.length > 0) {
      // Beğeni zaten varsa → geri çek
      await pool.query(
        "DELETE FROM SoruBegeni WHERE soruId = $1 AND kullaniciId = $2",
        [soruId, kullaniciId]
      );

      // PUAN -5 (eğer geri çekilirse)
      await pool.query(
        "UPDATE Kullanici SET puan = GREATEST(puan - 5, 0) WHERE kullaniciId = $1",
        [soranId]
      );

      return res.json({ message: "Beğeni geri çekildi" });
    }

    // Beğeni yoksa → ekle
    await pool.query(
      "INSERT INTO SoruBegeni (soruId, kullaniciId) VALUES ($1, $2)",
      [soruId, kullaniciId]
    );

    // PUAN +5 (yeni beğeni verildiğinde)
    await pool.query(
      "UPDATE Kullanici SET puan = puan + 5 WHERE kullaniciId = $1",
      [soranId]
    );

    res.json({ message: "Soru beğenildi" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Beğeni işlemi başarısız");
  }
};

module.exports = {
  konulariGetir,
  soruEkle,
  soruGuncelle,
  soruSil,
  cevapEkle,
  cevapGuncelle,
  cevapSil,
  sorulariGetir,
  soruDetayGetir,
  tepkiEkleGuncelle,
  soruBegen,
};
