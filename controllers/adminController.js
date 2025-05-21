const pool = require("../config/db");

const deleteForum = async (req, res) => {
  const forumId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM Forum WHERE forumId = $1 RETURNING *",
      [forumId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Silinecek forum bulunamadı." });
    }

    res.status(200).json({
      message: "Forum başarıyla silindi.",
      deletedForum: result.rows[0],
    });
  } catch (error) {
    console.error("Forum silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

const deleteEntry = async (req, res) => {
  const entryId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM Entry WHERE entryId = $1 RETURNING *",
      [entryId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Silinecek entry bulunamadı." });
    }

    res.status(200).json({
      message: "Entry başarıyla silindi.",
      deletedEntry: result.rows[0],
    });
  } catch (error) {
    console.error("Entry silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

const deleteSoru = async (req, res) => {
  const soruId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM Soru WHERE soruId = $1 RETURNING *",
      [soruId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Silinecek soru bulunamadı." });
    }

    res.status(200).json({
      message: "Soru başarıyla silindi.",
      deletedSoru: result.rows[0],
    });
  } catch (error) {
    console.error("Soru silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

const deleteCevap = async (req, res) => {
  const cevapId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM Cevap WHERE cevapId = $1 RETURNING *",
      [cevapId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Silinecek cevap bulunamadı." });
    }

    res.status(200).json({
      message: "Cevap başarıyla silindi.",
      deletedCevap: result.rows[0],
    });
  } catch (error) {
    console.error("Cevap silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

const deleteGrup = async (req, res) => {
  const grupId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM Grup WHERE grupId = $1 RETURNING *",
      [grupId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Silinecek grup bulunamadı." });
    }

    res.status(200).json({
      message: "Grup başarıyla silindi.",
      deletedGrup: result.rows[0],
    });
  } catch (error) {
    console.error("Grup silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

const guncelleBolumAktiflik = async (req, res) => {
  const { bolumId } = req.params;
  const { aktifMi } = req.body;

  if (typeof aktifMi !== "boolean") {
    return res
      .status(400)
      .json({ error: "aktifMi alanı true veya false olmalıdır." });
  }

  try {
    // 1. Mevcut aktifMi değerini al
    const result = await pool.query(
      "SELECT aktifMi FROM Bolum WHERE bolumId = $1",
      [bolumId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: `bolumId ${bolumId} bulunamadı.` });
    }

    const mevcutDurum = result.rows[0].aktifmi;

    // 2. Aynıysa güncelleme yapma
    if (mevcutDurum === aktifMi) {
      return res.status(200).json({
        message: `bolumId ${bolumId} zaten ${
          aktifMi ? "aktif" : "pasif"
        }. Güncelleme yapılmadı.`,
      });
    }

    // 3. Farklıysa güncelle
    await pool.query("UPDATE Bolum SET aktifMi = $1 WHERE bolumId = $2", [
      aktifMi,
      bolumId,
    ]);

    return res.status(200).json({
      message: `bolumId ${bolumId} aktifMi durumu ${aktifMi} olarak güncellendi.`,
    });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({ error: "Sunucu hatası." });
  }
};

const guncelleFakulteAktiflik = async (req, res) => {
  const { fakulteId } = req.params;
  const { aktifMi } = req.body;

  if (typeof aktifMi !== "boolean") {
    return res
      .status(400)
      .json({ error: "aktifMi alanı true veya false olmalıdır." });
  }

  try {
    const result = await pool.query(
      "SELECT aktifMi FROM Fakulte WHERE fakulteId = $1",
      [fakulteId]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: `fakulteId ${fakulteId} bulunamadı.` });
    }

    const mevcutDurum = result.rows[0].aktifmi;

    if (mevcutDurum === aktifMi) {
      return res.status(200).json({
        message: `fakulteId ${fakulteId} zaten ${
          aktifMi ? "aktif" : "pasif"
        }. Güncelleme yapılmadı.`,
      });
    }

    await pool.query("UPDATE Fakulte SET aktifMi = $1 WHERE fakulteId = $2", [
      aktifMi,
      fakulteId,
    ]);

    return res.status(200).json({
      message: `fakulteId ${fakulteId} aktifMi durumu ${aktifMi} olarak güncellendi.`,
    });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({ error: "Sunucu hatası." });
  }
};

const guncelleKullaniciAktiflik = async (req, res) => {
  const { kullaniciId } = req.params;
  const { aktifMi } = req.body;

  if (typeof aktifMi !== "boolean") {
    return res
      .status(400)
      .json({ error: "aktifMi alanı true veya false olmalıdır." });
  }

  try {
    const result = await pool.query(
      "SELECT aktifMi FROM Kullanici WHERE kullaniciId = $1",
      [kullaniciId]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: `kullaniciId ${kullaniciId} bulunamadı.` });
    }

    const mevcutDurum = result.rows[0].aktifmi;

    if (mevcutDurum === aktifMi) {
      return res.status(200).json({
        message: `kullaniciId ${kullaniciId} zaten ${
          aktifMi ? "aktif" : "pasif"
        }. Güncelleme yapılmadı.`,
      });
    }

    await pool.query(
      "UPDATE Kullanici SET aktifMi = $1 WHERE kullaniciId = $2",
      [aktifMi, kullaniciId]
    );

    return res.status(200).json({
      message: `kullaniciId ${kullaniciId} aktifMi durumu ${aktifMi} olarak güncellendi.`,
    });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({ error: "Sunucu hatası." });
  }
};

const kullaniciListeleme = async (req, res) => {
  const { kullaniciAdi } = req.query;

  try {
    const values = [];
    let query = `
      SELECT 
        k.kullaniciId,
        k.ad,
        k.soyad,
        k.kullaniciAdi,
        k.email,
        k.kullaniciTuruId,
        kt.ad AS kullanicirolu,
        k.puan,
        k.aktifMi,
        k.onaylandiMi,
        k.olusturmaTarihi
      FROM Kullanici k
      LEFT JOIN KullaniciTuru kt ON k.kullaniciTuruId = kt.kullaniciTuruId
      WHERE k.onaylandiMi = TRUE AND k.kullaniciTuruId IN (1, 2, 3)
    `;

    if (kullaniciAdi) {
      query += ` AND LOWER(k.kullaniciAdi) LIKE $1`;
      values.push(`%${kullaniciAdi.toLowerCase()}%`);
    }

    const { rows } = await pool.query(query, values);

    const result = rows.map((user) => ({
      user: {
        kullaniciid: user.kullaniciid,
        ad: user.ad,
        soyad: user.soyad,
        kullaniciadi: user.kullaniciadi,
        email: user.email,
        kullanicituruid: user.kullanicituruid,
        puan: user.puan,
        aktifmi: user.aktifmi,
        onaylandimi: user.onaylandimi,
        olusturmatarihi: user.olusturmatarihi,
        kullaniciTuruId: user.kullanicituruid,
        kullanicirolu: user.kullanicirolu,
      },
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

const mezunListeleme = async (req, res) => {
  const { kullaniciAdi } = req.query;

  try {
    let query = `
      SELECT 
        k.kullaniciId,
        k.ad,
        k.soyad,
        k.kullaniciAdi,
        k.email,
        k.kullaniciTuruId,
        kt.ad AS kullanicirolu,
        k.puan,
        k.aktifMi,
        k.onaylandiMi,
        k.olusturmaTarihi
      FROM Kullanici k
      LEFT JOIN KullaniciTuru kt ON k.kullaniciTuruId = kt.kullaniciTuruId
      WHERE k.onaylandiMi = TRUE AND k.kullaniciTuruId = 3
    `;

    const values = [];

    if (kullaniciAdi) {
      query += ` AND k.kullaniciAdi ILIKE $1`;
      values.push(`%${kullaniciAdi}%`);
    }

    const { rows } = await pool.query(query, values);

    const result = rows.map((user) => ({
      user: {
        kullaniciid: user.kullaniciid,
        ad: user.ad,
        soyad: user.soyad,
        kullaniciadi: user.kullaniciadi,
        email: user.email,
        kullanicituruid: user.kullanicituruid,
        puan: user.puan,
        aktifmi: user.aktifmi,
        onaylandimi: user.onaylandimi,
        olusturmatarihi: user.olusturmatarihi,
        kullaniciTuruId: user.kullanicituruid,
        kullanicirolu: user.kullanicirolu,
      },
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

const adminOner = async (req, res) => {
  const onerenKullaniciId = req.user.kullaniciId; // JWT'den gelen
  const { onerilenKullaniciId } = req.body;

  try {
    if (onerenKullaniciId === onerilenKullaniciId) {
      return res.status(400).json({ message: "Kendinizi öneremezsiniz." });
    }

    // Kullanıcı gerçekten var mı kontrolü
    const { rowCount } = await pool.query(
      "SELECT 1 FROM Kullanici WHERE kullaniciId = $1",
      [onerilenKullaniciId]
    );

    if (rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Önerilen kullanıcı bulunamadı." });
    }

    // Aynı öneri zaten var mı kontrolü
    const { rowCount: existingCount } = await pool.query(
      `SELECT 1 FROM AdminOneri 
             WHERE onerenKullaniciId = $1 AND onerilenKullaniciId = $2 AND durum = 'Beklemede'`,
      [onerenKullaniciId, onerilenKullaniciId]
    );

    if (existingCount > 0) {
      return res.status(400).json({
        message: "Bu kullanıcı için zaten bekleyen bir öneriniz var.",
      });
    }

    // Yeni öneri ekleme
    await pool.query(
      `INSERT INTO AdminOneri (onerenKullaniciId, onerilenKullaniciId)
             VALUES ($1, $2)`,
      [onerenKullaniciId, onerilenKullaniciId]
    );

    return res
      .status(201)
      .json({ message: "Admin önerisi başarıyla yapıldı." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
};

const bekleyenAdminOnerileri = async (req, res) => {
  try {
    const { rows } = await pool.query(`
            SELECT 
                ao.oneriId,
                k1.kullaniciAdi AS onerenKullaniciAdi,
                k2.kullaniciAdi AS onerilenKullaniciAdi,
                ao.oneriTarihi
            FROM AdminOneri ao
            JOIN Kullanici k1 ON ao.onerenKullaniciId = k1.kullaniciId
            JOIN Kullanici k2 ON ao.onerilenKullaniciId = k2.kullaniciId
            WHERE ao.durum = 'Beklemede'
            ORDER BY ao.oneriTarihi DESC
        `);

    res.status(200).json(rows);
  } catch (err) {
    console.error("Bekleyen admin önerileri listelenirken hata:", err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

const superUserKararEkle = async (req, res) => {
  const { oneriId, karar } = req.body;

  if (!oneriId || !karar) {
    return res.status(400).json({ mesaj: "oneriId ve karar gereklidir." });
  }

  if (!["Onaylandi", "Reddedildi"].includes(karar)) {
    return res.status(400).json({
      mesaj:
        'Geçersiz karar değeri. Sadece "Onaylandi" veya "Reddedildi" olabilir.',
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO SuperUserKarar (oneriId, karar) VALUES ($1, $2) RETURNING *",
      [oneriId, karar]
    );

    res.status(201).json({
      mesaj: "Karar başarıyla eklendi.",
      karar: result.rows[0],
    });
  } catch (error) {
    console.error("Karar eklenirken hata:", error);
    res.status(500).json({ mesaj: "Sunucu hatası." });
  }
};

const adminListeleme = async (req, res) => {
  const { kullaniciAdi } = req.query;

  try {
    let query = `
      SELECT 
        k.kullaniciId,
        k.ad,
        k.soyad,
        k.kullaniciAdi,
        k.email,
        k.kullaniciTuruId,
        kt.ad AS kullanicirolu,
        k.puan,
        k.aktifMi,
        k.onaylandiMi,
        k.olusturmaTarihi
      FROM Kullanici k
      LEFT JOIN KullaniciTuru kt ON k.kullaniciTuruId = kt.kullaniciTuruId
      WHERE k.onaylandiMi = TRUE AND k.kullaniciTuruId = 4
    `;

    const values = [];

    if (kullaniciAdi) {
      query += ` AND k.kullaniciAdi ILIKE $1`;
      values.push(`%${kullaniciAdi}%`);
    }

    const { rows } = await pool.query(query, values);

    const result = rows.map((user) => ({
      user: {
        kullaniciid: user.kullaniciid,
        ad: user.ad,
        soyad: user.soyad,
        kullaniciadi: user.kullaniciadi,
        email: user.email,
        kullanicituruid: user.kullanicituruid,
        puan: user.puan,
        aktifmi: user.aktifmi,
        onaylandimi: user.onaylandimi,
        olusturmatarihi: user.olusturmatarihi,
        kullaniciTuruId: user.kullanicituruid,
        kullanicirolu: user.kullanicirolu,
      },
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

const dogrudanAdminYap = async (req, res) => {
  const { kullaniciId } = req.body;

  if (!kullaniciId) {
    return res.status(400).json({ mesaj: "kullaniciId gereklidir." });
  }

  try {
    const result = await pool.query(
      "UPDATE Kullanici SET kullaniciTuruId = 4 WHERE kullaniciId = $1 RETURNING *",
      [kullaniciId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ mesaj: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({
      mesaj: "Kullanıcı başarıyla admin yapıldı.",
      kullanici: result.rows[0],
    });
  } catch (error) {
    console.error("Admin yaparken hata:", error);
    res.status(500).json({ mesaj: "Sunucu hatası." });
  }
};

module.exports = {
  deleteForum,
  deleteEntry,
  deleteSoru,
  deleteCevap,
  deleteGrup,
  guncelleBolumAktiflik,
  guncelleFakulteAktiflik,
  guncelleKullaniciAktiflik,
  kullaniciListeleme,
  mezunListeleme,
  adminOner,
  bekleyenAdminOnerileri,
  superUserKararEkle,
  adminListeleme,
  dogrudanAdminYap,
};
