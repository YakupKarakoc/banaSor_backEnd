const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Kullanıcı kimlik doğrulama işlemleri
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ad:
 *                 type: string
 *               soyad:
 *                 type: string
 *               kullaniciAdi:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               sifre:
 *                 type: string
 *                 format: password
 *               kullaniciTuruId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Kayıt başarılı
 *       400:
 *         description: Kullanıcı zaten mevcut
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               sifre:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Giriş başarılı, JWT döner
 *       400:
 *         description: Geçersiz kimlik bilgileri
 */
router.post("/login", login);

module.exports = router;
