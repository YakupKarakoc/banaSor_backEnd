const pool = require("../config/db");

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

module.exports = {
  kullaniciSorulariGetir,
  kullaniciCevaplariGetir,
};
