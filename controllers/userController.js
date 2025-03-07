const pool = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT kullaniciId, ad, soyad, email FROM Kullanici WHERE kullaniciId = $1",
      [req.user.kullaniciId]
    );
    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
