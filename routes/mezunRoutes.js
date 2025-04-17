const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  dogrulamaBaslat,
  kodlariDogrula,
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
 *     summary: Referans kişiler kendilerine gelen kodları girerek mezunu doğrular
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
 *                 example: mehmet123
 *               kod1:
 *                 type: string
 *                 example: "123456"
 *               kod2:
 *                 type: string
 *                 example: "789012"
 *             required:
 *               - kullaniciAdi
 *               - kod1
 *               - kod2
 *     responses:
 *       200:
 *         description: Kodlar kontrol edildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kodlar kontrol edildi
 *                 dogrulama1:
 *                   type: boolean
 *                 dogrulama2:
 *                   type: boolean
 *                 dogrulandiMi:
 *                   type: boolean
 *       400:
 *         description: Kodların süresi dolmuş
 *       404:
 *         description: Doğrulama kaydı bulunamadı
 *       500:
 *         description: Kod doğrulama sırasında hata oluştu
 */
router.post("/kod-dogrula", kodlariDogrula);

module.exports = router;
