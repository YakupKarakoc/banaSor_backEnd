const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Authorization header yoksa
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Yetkisiz erişim. Token eksik." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 🔥 En kritik satır: middleware'ler burayı kullanacak

    // Debug logu (ilk test için açabilirsin sonra silebilirsin)
    console.log("JWT decoded:", req.user);

    next();
  } catch (err) {
    return res.status(403).json({ error: "Geçersiz token" });
  }
};

module.exports = authenticateToken;
