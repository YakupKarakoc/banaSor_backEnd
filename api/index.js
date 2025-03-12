const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/user");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: "Kullanıcı API",
      version: "1.0.0",
      description: "Kullanıcı kayıt, giriş ve profil API'si",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: "BanaSor API çalışıyor 🚀" });
});

// Rotanı ayarla
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Yerel çalıştırma için tekrar aktif et
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server yerelde ${port} portunda çalışıyor 🚀`);
});

// Serverless (Vercel) ortamı için
module.exports = app;
