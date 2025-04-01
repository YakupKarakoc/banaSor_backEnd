const express = require("express");
const {
  register,
  login,
  sendVerification,
  verifyCode,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Kullanıcı kimlik doğrulama işlemleri
 */

/**
 * @swagger
 * /api/auth/register:
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
 * /api/auth/login:
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

/**
 * @swagger
 * /api/auth/sendVerification:
 *   post:
 *     summary: Kullanıcıya doğrulama kodu gönderir.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kullaniciId
 *               - email
 *             properties:
 *               kullaniciId:
 *                 type: integer
 *                 example: 1
 *               email:
 *                 type: string
 *                 example: "ornek@mail.com"
 *     responses:
 *       200:
 *         description: Doğrulama kodu başarıyla gönderildi.
 *       500:
 *         description: Sunucu hatası.
 */
router.post("/sendVerification", sendVerification);

/**
 * @swagger
 * /api/auth/verifyCode:
 *   post:
 *     summary: Kullanıcı doğrulama kodunu girerek hesabını onaylar.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kullaniciId
 *               - kod
 *             properties:
 *               kullaniciId:
 *                 type: integer
 *                 example: 1
 *               kod:
 *                 type: string
 *                 example: "ABC12345"
 *     responses:
 *       200:
 *         description: E-posta başarıyla doğrulandı.
 *       400:
 *         description: Kod geçersiz veya süresi dolmuş.
 *       500:
 *         description: Sunucu hatası.
 */
router.post("/verifyCode", verifyCode);

/**
 * @swagger
 * /api/auth/forgotPassword:
 *   post:
 *     summary: Şifre sıfırlama kodunu gönderme
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
 *                 example: "example@mail.com"
 *     responses:
 *       200:
 *         description: Şifre sıfırlama işlemi için mailinize kod gönderilmiştir.
 *       400:
 *         description: Geçersiz mail adresi.
 *       500:
 *         description: Sunucu hatası.
 */
router.post("/forgotPassword", forgotPassword);

/**
 * @swagger
 * /api/auth/resetPassword:
 *   post:
 *     summary: Şifre sıfırlama
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
 *                 example: "example@mail.com"
 *               resetCode:  # Burada 'code' yerine 'resetCode' kullanılmalı
 *                 type: string
 *                 example: "abcd1234"
 *               newPassword:
 *                 type: string
 *                 example: "YeniŞifre123!"
 *     responses:
 *       200:
 *         description: Şifreniz başarıyla güncellenmiştir.
 *       400:
 *         description: Geçersiz veya süresi dolmuş kod.
 *       500:
 *         description: Sunucu hatası.
 */
router.post("/resetPassword", resetPassword);

module.exports = router;
