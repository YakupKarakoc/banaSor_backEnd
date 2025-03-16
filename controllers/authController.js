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

    const user = await pool.query("SELECT * FROM Kullanici WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Geçersiz e-posta veya şifre" });
    }

    const validPassword = await bcrypt.compare(sifre, user.rows[0].sifre);
    if (!validPassword) {
      return res.status(400).json({ error: "Geçersiz e-posta veya şifre" });
    }

    const token = jwt.sign(
      { kullaniciId: user.rows[0].kullaniciid, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Giriş başarılı", token });
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

    // Kullanıcıyı doğrulama işlemi
    await pool.query(
      `UPDATE KullaniciDogrulama SET dogrulandiMi = true WHERE dogrulamaId = $1`,
      [result.rows[0].dogrulamaid]
    );

    res.status(200).json({ message: "E-posta başarıyla doğrulandı." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
