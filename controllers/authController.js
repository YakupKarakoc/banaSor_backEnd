const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

dotenv.config();

exports.register = async (req, res, next) => {
  try {
    const { ad, soyad, kullaniciAdi, email, sifre, kullaniciTuruId } = req.body;

    // Kullanıcı adı veya e-posta mevcut mu?
    const checkUser = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciAdi = $1 OR email = $2",
      [kullaniciAdi, email]
    );

    if (checkUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Kullanıcı adı veya e-posta zaten kullanılıyor." });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(sifre, 10);

    // Yeni kullanıcıyı ekle
    const newUser = await pool.query(
      `INSERT INTO Kullanici (ad, soyad, kullaniciAdi, email, sifre, kullaniciTuruId, puan, aktifMi, onaylandiMi, olusturmaTarihi) 
       VALUES ($1, $2, $3, $4, $5, $6, 0, TRUE, FALSE, CURRENT_TIMESTAMP) RETURNING *`,
      [ad, soyad, kullaniciAdi, email, hashedPassword, kullaniciTuruId]
    );

    res.status(201).json({ message: "Kayıt başarılı!", user: newUser.rows[0] });
  } catch (error) {
    console.error("Kayıt Hatası:", error.message); // Hata detaylarını yazdır
    next(error); // Express hata middleware'ine yönlendir
  }
};

exports.login = async (req, res) => {
  try {
    const { email, sifre } = req.body;

    const user = await pool.query(
      `SELECT 
  k.*, 
  k.kullaniciTuruId AS "kullaniciTuruId", 
  kt.ad AS kullanicirolu
FROM Kullanici k
JOIN KullaniciTuru kt ON k.kullaniciTuruId = kt.kullaniciTuruId
WHERE k.email = $1;

`,
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Geçersiz e-posta veya şifre" });
    }

    const userData = user.rows[0];

    if (!userData.onaylandimi) {
      return res.status(403).json({ error: "Hesabınız henüz onaylanmamış." });
    }

    const validPassword = await bcrypt.compare(sifre, userData.sifre);
    if (!validPassword) {
      return res.status(400).json({ error: "Geçersiz e-posta veya şifre" });
    }

    const token = jwt.sign(
      {
        kullaniciId: userData.kullaniciid,
        email: userData.email,
        kullaniciTuruId: userData.kullanicituruid,
            // kullanicirolu: userData.kullanicirolu  // ← ekle!

      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { sifre: _, ...userInfo } = userData;
    res.status(200).json({ message: "Giriş başarılı", token, user: userInfo });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // Örn: "A1B2C3"
};

// 📌 Doğrulama kodunu e-posta ile gönderme fonksiyonu
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // 587 için 'false' olmalı
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendVerification = async (req, res) => {
  try {
    const { kullaniciId, email } = req.body;
    const kod = generateVerificationCode();

    await pool.query(
      `INSERT INTO KullaniciDogrulama (kullaniciId, kod, bitisTarihi) 
       VALUES ($1, $2, NOW() + INTERVAL '10 minutes')`,
      [kullaniciId, kod]
    );

    await transporter.sendMail({
      from: `"BanaSor" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "E-posta Doğrulama Kodu",
      text: `Doğrulama kodunuz: ${kod} (10 dakika içinde kullanmalısınız)`,
    });

    res.status(200).json({ message: "Doğrulama kodu e-posta ile gönderildi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Kullanıcı doğrulama kodunu onaylama fonksiyonu
exports.verifyCode = async (req, res) => {
  try {
    const { kullaniciId, kod } = req.body;

    const result = await pool.query(
      `SELECT * FROM KullaniciDogrulama 
       WHERE kullaniciId = $1 AND kod = $2 
       AND bitisTarihi > NOW() AND dogrulandiMi = false`,
      [kullaniciId, kod]
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Kod geçersiz veya süresi dolmuş." });
    }

    // İşlem başarılıysa: hem KullaniciDogrulama tablosunda dogrulandiMi'yi true yap hem de Kullanici tablosunda onaylandiMi'yi true yap
    await pool.query(
      `UPDATE KullaniciDogrulama 
       SET dogrulandiMi = true, onaylamaTarihi = NOW()
       WHERE dogrulamaId = $1`,
      [result.rows[0].dogrulamaid]
    );

    await pool.query(
      `UPDATE Kullanici 
       SET onaylandiMi = true 
       WHERE kullaniciId = $1`,
      [kullaniciId]
    );

    res
      .status(200)
      .json({ message: "Kullanıcı başarıyla doğrulandı ve onaylandı." });
  } catch (error) {
    console.error("Doğrulama hatası:", error);
    res.status(500).json({ error: "Sunucu hatası." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; // Kullanıcıdan sadece e-posta alıyoruz

    // Kullanıcıyı email ile bul
    const userQuery = `
      SELECT * FROM Kullanici 
      WHERE email = $1
    `;

    console.log("E-posta:", email);

    const user = await pool.query(userQuery, [email]);
    console.log("Kullanıcı Verisi:", user.rows);

    if (user.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Bu e-posta adresine sahip kullanıcı bulunamadı" });
    }

    const kullaniciId = user.rows[0].kullaniciid;
    const resetCode = crypto.randomBytes(4).toString("hex"); // 4 baytlık rastgele kod
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika geçerli

    // Şifre sıfırlama kodunu veritabanına ekle
    await pool.query(
      "INSERT INTO SifreSifirlama (kullaniciId, kod, bitisTarihi) VALUES ($1, $2, $3)",
      [kullaniciId, resetCode, expirationTime]
    );

    // 📩 Kullanıcıya e-posta gönderme işlemi
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // 587 için 'false' olmalı
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"BanaSor" <${process.env.SMTP_USER}>`,
      to: user.rows[0].email,
      subject: "Şifre Sıfırlama Kodu",
      text: `Şifre sıfırlama kodunuz: ${resetCode} (15 dakika geçerlidir)`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Şifre sıfırlama kodu e-posta ile gönderildi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    // Kullanıcıyı email ile bul
    const userQuery = `SELECT * FROM Kullanici WHERE email = $1`;
    const user = await pool.query(userQuery, [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Geçersiz kullanıcı" });
    }

    const kullaniciId = user.rows[0].kullaniciid;

    // Şifre sıfırlama kodunu kontrol et
    const resetQuery = `
      SELECT * FROM SifreSifirlama 
      WHERE kullaniciId = $1 AND kod = $2 AND NOW() < bitisTarihi AND sifirlandiMi = FALSE
    `;

    const resetEntry = await pool.query(resetQuery, [kullaniciId, resetCode]);

    // 📌 Debug Logları
    console.log("Girilen Reset Kodu:", resetCode);
    console.log("Veritabanındaki Kayıtlar:", resetEntry.rows);

    if (resetEntry.rows.length === 0) {
      return res.status(400).json({ error: "Geçersiz veya süresi dolmuş kod" });
    }

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Kullanıcının şifresini güncelle
    await pool.query("UPDATE Kullanici SET sifre = $1 WHERE kullaniciId = $2", [
      hashedPassword,
      kullaniciId,
    ]);

    // Kullanılan şifre sıfırlama kodunu geçersiz hale getir
    await pool.query(
      "UPDATE SifreSifirlama SET sifirlandiMi = TRUE WHERE sifirlamaId = $1",
      [resetEntry.rows[0].sifirlamaid]
    );

    res.status(200).json({ message: "Şifre başarıyla güncellendi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
