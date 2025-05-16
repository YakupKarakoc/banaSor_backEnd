const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Routes importları düzeltildi
const authRoutes = require("../routes/authRoutes");

const educationRoutes = require("../routes/educationRoutes");
const ogrenciRoutes = require("../routes/ogrenciRoutes");
const mezunRoutes = require("../routes/mezunRoutes");
const takipRoutes = require("../routes/takipRoutes");
const soruRoutes = require("../routes/soruRoutes");
const profilRoutes = require("../routes/profilRoutes");
const forumRoutes = require("../routes/forumRoutes");
const grupRoutes = require("../routes/grupRoutes");
const adminRoutes = require("../routes/adminRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Swagger ayarları güncellendi
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "BanaSor API",
      version: "1.0.0",
      description: "Kullanıcı kayıt, giriş ve forum API'leri",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./routes/*.js"], // Dizin yolu doğru ayarlandı
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Test endpoint (root)
app.get("/", (req, res) => {
  res.json({ message: "BanaSor API çalışıyor 🚀" });
});

// Route tanımlamaları düzeltildi
app.use("/api/auth", authRoutes);

app.use("/api/education", educationRoutes);
app.use("/api/ogrenci", ogrenciRoutes);
app.use("/api/mezun", mezunRoutes);
app.use("/api/takip", takipRoutes);
app.use("/api/soru", soruRoutes);
app.use("/api/profil", profilRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/grup", grupRoutes);
app.use("/api/admin", adminRoutes);

// Yerelde test için bunu kullan (Vercel deploy yaparken kapat):
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server ${port} portunda çalışıyor!`);
  console.log(`📄 API dökümantasyonu: http://localhost:${port}/api-docs/`);
});

app.use((err, req, res, next) => {
  console.error("🔥 Hata yakalandı:", err); // Konsola detaylı hata yazdır
  res.status(500).json({
    error: "Sunucu hatası",
    details: err.message,
  });
});

module.exports = app;
