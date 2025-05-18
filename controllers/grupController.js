const pool = require("../config/db"); // Veritabanı bağlantın

// İstanbul saatine göre timestamp oluşturma
function getIstanbulTime() {
  const istanbulTime = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Istanbul",
  });
  return new Date(istanbulTime);
}

// Grup oluşturma
const olusturGrup = async (req, res) => {
  const olusturanId = req.user.kullaniciId;
  const istanbulTime = getIstanbulTime();
  const { ad } = req.body;

  if (!ad) {
    return res.status(400).json({ hata: "Grup adı gerekli" });
  }

  try {
    // Kullanıcının aktifliğini kontrol et
    const kullanici = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciId = $1 AND aktifMi = true",
      [olusturanId]
    );

    if (kullanici.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Aktif olmayan kullanıcılar işlem yapamaz" });
    }

    // Grup oluştur
    const grupSorgu = await pool.query(
      "INSERT INTO Grup (ad, olusturanId, olusturmaTarihi) VALUES ($1, $2, $3) RETURNING grupId",
      [ad, olusturanId, istanbulTime]
    );

    const grupId = grupSorgu.rows[0].grupid;

    // Oluşturanı gruba üye olarak ekle
    await pool.query("INSERT INTO GrupUye (grupId, uyeId) VALUES ($1, $2)", [
      grupId,
      olusturanId,
    ]);

    return res
      .status(201)
      .json({ mesaj: "Grup başarıyla oluşturuldu", grupId });
  } catch (error) {
    console.error("Grup oluşturma hatası:", error);
    return res.status(500).json({ hata: "Sunucu hatası" });
  }
};
// Gruba katılma
const katilGrup = async (req, res) => {
  const { grupId } = req.body;
  const uyeId = req.user.kullaniciId;

  if (!grupId) {
    return res.status(400).json({ message: "grupId gerekli" });
  }

  try {
    // Kullanıcının aktif olup olmadığını kontrol et
    const kullanici = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciId = $1 AND aktifMi = true",
      [uyeId]
    );

    if (kullanici.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Aktif olmayan kullanıcılar işlem yapamaz" });
    }

    // Gruba katılma işlemi
    await pool.query(
      `INSERT INTO GrupUye (grupId, uyeId)
       VALUES ($1, $2)`,
      [grupId, uyeId]
    );

    res.status(200).json({ message: "Gruba başarıyla katıldınız" });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Zaten bu gruptasınız" });
    }
    console.error("Gruba katılma hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

const gruptanCik = async (req, res) => {
  const uyeId = req.user.kullaniciId;
  const grupId = parseInt(req.params.grupId, 10);

  if (!grupId) {
    return res.status(400).json({ hata: "Grup ID gerekli" });
  }

  try {
    // Kullanıcının aktifliğini kontrol et
    const kullanici = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciId = $1 AND aktifMi = true",
      [uyeId]
    );

    if (kullanici.rows.length === 0) {
      return res
        .status(403)
        .json({ mesaj: "Pasif kullanıcılar gruptan çıkamaz" });
    }

    // Kullanıcının üyeliğini kontrol et
    const uyelikKontrol = await pool.query(
      "SELECT * FROM GrupUye WHERE grupId = $1 AND uyeId = $2",
      [grupId, uyeId]
    );

    if (uyelikKontrol.rows.length === 0) {
      return res.status(404).json({ mesaj: "Kullanıcı bu grubun üyesi değil" });
    }

    // Kullanıcıyı gruptan çıkar
    await pool.query("DELETE FROM GrupUye WHERE grupId = $1 AND uyeId = $2", [
      grupId,
      uyeId,
    ]);

    return res.status(200).json({ mesaj: "Gruptan başarıyla çıkıldı" });
  } catch (error) {
    console.error("Gruptan çıkma hatası:", error);
    return res.status(500).json({ hata: "Sunucu hatası" });
  }
};

const listeleTumGruplar = async (req, res) => {
  const kullaniciId = req.user.kullaniciId;

  try {
    const gruplar = await pool.query(
      `SELECT 
         g.grupId,
         g.ad,
         g.olusturmaTarihi,
         k.kullaniciAdi,
         COUNT(gu.uyeId) AS uyeSayisi
       FROM 
         Grup g
       LEFT JOIN 
         GrupUye gu ON g.grupId = gu.grupId
       INNER JOIN 
         Kullanici k ON g.olusturanId = k.kullaniciId
       GROUP BY 
         g.grupId, k.kullaniciAdi
       ORDER BY 
         g.olusturmaTarihi DESC`
    );

    return res.status(200).json({ gruplar: gruplar.rows });
  } catch (error) {
    console.error("Tüm grupları listeleme hatası:", error);
    return res.status(500).json({ hata: "Sunucu hatası" });
  }
};

const silGrup = async (req, res, next) => {
  const userId = req.user.kullaniciId;
  const groupId = parseInt(req.params.id);

  try {
    const kullanici = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciId = $1 AND aktifMi = true",
      [userId]
    );

    if (kullanici.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Aktif olmayan kullanıcılar işlem yapamaz" });
    }

    // 1. Grup var mı ve oluşturan bu kullanıcı mı?
    const { rows: groupRows } = await pool.query(
      "SELECT * FROM Grup WHERE grupId = $1",
      [groupId]
    );

    if (groupRows.length === 0) {
      return res.status(404).json({ message: "Grup bulunamadı." });
    }

    const group = groupRows[0];

    if (group.olusturanid !== userId) {
      return res
        .status(403)
        .json({ message: "Sadece grubu oluşturan kişi silebilir." });
    }

    // 2. Üye sayısını kontrol et
    const { rows: uyeRows } = await pool.query(
      "SELECT COUNT(*) FROM GrupUye WHERE grupId = $1",
      [groupId]
    );

    const uyeSayisi = parseInt(uyeRows[0].count);

    if (uyeSayisi >= 2) {
      return res
        .status(400)
        .json({ message: "Grup 2 veya daha fazla üyeye sahipse silinemez." });
    }

    // Silme işlemi
    {
      await pool.query("DELETE FROM Grup WHERE grupId = $1", [groupId]);
    }

    return res.status(200).json({ message: "Grup başarıyla silindi." });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

module.exports = {
  olusturGrup,
  katilGrup,
  gruptanCik,
  listeleTumGruplar,
  silGrup,
};
