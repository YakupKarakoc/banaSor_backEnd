const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const dotenv = require("dotenv");

dotenv.config();

exports.register = async (req, res) => {
  try {
    const { ad, soyad, kullaniciAdi, email, sifre, kullaniciTuruId } = req.body;

    const checkUser = await pool.query(
      "SELECT * FROM Kullanici WHERE kullaniciAdi = $1 OR email = $2",
      [kullaniciAdi, email]
    );
    if (checkUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Kullanıcı adı veya e-posta zaten kullanılıyor." });
    }
  
    const hashedPassword = await bcrypt.hash(sifre, 10);

    const newUser = await pool.query(
      `INSERT INTO Kullanici (ad, soyad, kullaniciAdi, email, sifre, kullaniciTuruId, aktifMi) 
             VALUES ($1, $2, $3, $4, $5, $6, 'Aktif') RETURNING *`,
      [ad, soyad, kullaniciAdi, email, hashedPassword, kullaniciTuruId]
    );

    res.status(201).json({ message: "Kayıt başarılı!", user: newUser.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
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
