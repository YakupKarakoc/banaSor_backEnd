const express = require("express");
const dotenv = require("dotenv");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// Swagger Ayarları
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kullanıcı API",
      version: "1.0.0",
      description: "Kullanıcı kayıt, giriş ve profil API'si",
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
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotalar
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Sunucuyu Başlat
app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});
