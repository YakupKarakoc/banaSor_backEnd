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

module.exports = {
  olusturGrup,
  katilGrup,
};
