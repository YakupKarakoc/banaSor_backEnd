const db = require("../config/db");
const nodemailer = require("nodemailer");

// ✅ Mail gönderme fonksiyonu
const sendMail = async (to, code, hedefKullaniciAdi) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"BanaSor" <${process.env.SMTP_USER}>`,
    to,
    subject: "Mezun Doğrulama Referans Kodu",
    text: `${hedefKullaniciAdi} adlı kullanıcı mezun olduğunu doğrulamak için sizi referans gösterdi. Doğrulama kodu: ${code} (15 dakika geçerlidir). Lütfen sistem üzerinden doğrulama yapınız.`,
  };

  await transporter.sendMail(mailOptions);
};

exports.dogrulamaBaslat = async (req, res) => {
  const { email, universiteId, bolumId, dogrulamaMail1, dogrulamaMail2 } =
    req.body;

  console.log("dogrulamaBaslat çağrıldı:");
  console.log("Gelen email:", email);
  console.log("Body:", {
    universiteId,
    bolumId,
    dogrulamaMail1,
    dogrulamaMail2,
  });

  const kod1 = Math.floor(100000 + Math.random() * 900000).toString();
  const kod2 = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // E-posta ile kullanıcıyı bul
    const userResult = await db.query(
      `SELECT kullaniciId, kullaniciAdi FROM Kullanici WHERE email = $1`,
      [email]
    );

    if (userResult.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Bu e-posta ile kayıtlı bir kullanıcı bulunamadı." });
    }

    const kullaniciId = userResult.rows[0].kullaniciid;
    const kullaniciAdi = userResult.rows[0].kullaniciadi;

    // Mezun kaydını oluştur
    const mezunResult = await db.query(
      `INSERT INTO Mezun (kullaniciId, universiteId, bolumId, dogrulamaMail1, dogrulamaMail2, dogrulamaDurumu)
       VALUES ($1, $2, $3, $4, $5, 'Bekliyor') RETURNING mezunId`,
      [kullaniciId, universiteId, bolumId, dogrulamaMail1, dogrulamaMail2]
    );

    const mezunId = mezunResult.rows[0].mezunid;

    // MezunDogrulama tablosuna kaydet
    await db.query(
      `INSERT INTO MezunDogrulama (mezunId, kod1, kod2, bitisTarihi)
       VALUES ($1, $2, $3, (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') + INTERVAL '3 hours 15 minutes')`,
      [mezunId, kod1, kod2]
    );

    // Mail gönder
    await sendMail(dogrulamaMail1, kod1, kullaniciAdi);
    await sendMail(dogrulamaMail2, kod2, kullaniciAdi);

    res.status(201).json({
      message: "Mezun doğrulama süreci başlatıldı ve kodlar gönderildi.",
    });
  } catch (err) {
    console.error("doğrulama başlatma hatası:", err);
    res.status(500).json({ error: "İşlem sırasında sunucu hatası oluştu." });
  }
};

// ✅ Kod doğrulama (her referans ayrı şekilde yapar)
exports.kodDogrula = async (req, res) => {
  const { kullaniciAdi, girilenKod } = req.body;

  try {
    const result = await db.query(
      `SELECT d.*, m.mezunId FROM MezunDogrulama d
       JOIN Mezun m ON m.mezunId = d.mezunId
       JOIN Kullanici k ON k.kullaniciId = m.kullaniciId
       WHERE k.kullaniciAdi = $1 
       ORDER BY baslangicTarihi DESC LIMIT 1`,
      [kullaniciAdi]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Doğrulama kaydı bulunamadı" });
    }

    const dogrulama = result.rows[0];
    let dogrulama1 = dogrulama.dogrulama1;
    let dogrulama2 = dogrulama.dogrulama2;

    const suAn = new Date();
    const bitis = new Date(dogrulama.bitistarihi);
    if (suAn > bitis) {
      return res.status(400).json({ error: "Kodun süresi dolmuş" });
    }

    // Kodu kontrol et
    if (girilenKod === dogrulama.kod1) dogrulama1 = true;
    if (girilenKod === dogrulama.kod2) dogrulama2 = true;

    await db.query(
      `UPDATE MezunDogrulama SET dogrulama1 = $1, dogrulama2 = $2 WHERE dogrulamaId = $3`,
      [dogrulama1, dogrulama2, dogrulama.dogrulamaid]
    );

    // Her iki referans onayladıysa mezunluğu onayla
    if (dogrulama1 && dogrulama2) {
      await db.query(
        `UPDATE Mezun SET dogrulamaDurumu = 'Onaylandi' WHERE mezunId = $1`,
        [dogrulama.mezunid]
      );
      await db.query(
        `UPDATE MezunDogrulama SET dogrulanmaTarihi = CURRENT_TIMESTAMP WHERE dogrulamaId = $1`,
        [dogrulama.dogrulamaid]
      );
    }

    res.json({
      message: "Kod kontrol edildi",
      dogrulama1,
      dogrulama2,
      dogrulandiMi: dogrulama1 && dogrulama2,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kod doğrulama sırasında hata oluştu" });
  }
};
