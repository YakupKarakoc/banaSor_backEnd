const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  dogrulamaBaslat,
  kodDogrula,
} = require("../controllers/mezunController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mezun
 *   description: Mezun doğrulama işlemleri
 */

/**
 * @swagger
 * /api/mezun/dogrulama-baslat:
 *   post:
 *     summary: Mezun olmak isteyen kullanıcı doğrulama sürecini başlatır (giriş gerektirmez)
 *     tags: [Mezun]
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
 *               universiteId:
 *                 type: integer
 *               bolumId:
 *                 type: integer
 *               dogrulamaMail1:
 *                 type: string
 *                 format: email
 *               dogrulamaMail2:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *               - universiteId
 *               - bolumId
 *               - dogrulamaMail1
 *               - dogrulamaMail2
 *     responses:
 *       201:
 *         description: Kodlar gönderildi
 *       404:
 *         description: E-posta ile kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

router.post("/dogrulama-baslat", dogrulamaBaslat);

/**
 * @swagger
 * /api/mezun/kod-dogrula:
 *   post:
 *     summary: Referans kişi kendisine gelen kodu girerek doğrulama yapar
 *     tags: [Mezun]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kullaniciAdi:
 *                 type: string
 *               girilenKod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kod kontrol edildi
 *       400:
 *         description: Kod süresi dolmuş
 *       404:
 *         description: Doğrulama kaydı bulunamadı
 */
router.post("/kod-dogrula", kodDogrula);

module.exports = router;
