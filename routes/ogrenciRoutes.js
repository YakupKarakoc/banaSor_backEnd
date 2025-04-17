const express = require("express");
const router = express.Router();
const { ogrenciKaydetEmail } = require("../controllers/ogrenciController");

/**
 * @swagger
 * /api/ogrenci/kayit:
 *   post:
 *     summary: E-posta ile yeni bir öğrenci kaydı oluşturur (giriş gerekmez)
 *     tags:
 *       - Öğrenci
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - universiteId
 *               - bolumId
 *             properties:
 *               email:
 *                 type: string
 *                 example: ornek@student.edu.tr
 *               universiteId:
 *                 type: integer
 *                 example: 3
 *               bolumId:
 *                 type: integer
 *                 example: 7
 *     responses:
 *       201:
 *         description: Öğrenci başarıyla kaydedildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Öğrenci başarıyla kaydedildi.
 *                 ogrenci:
 *                   type: object
 *                   properties:
 *                     ogrenciId:
 *                       type: integer
 *                     kullaniciId:
 *                       type: integer
 *                     universiteId:
 *                       type: integer
 *                     bolumId:
 *                       type: integer
 *       400:
 *         description: Eksik veya geçersiz veri.
 *       403:
 *         description: Sadece üniversite öğrencileri kayıt olabilir.
 *       404:
 *         description: E-posta ile kullanıcı veya bölüm bulunamadı.
 *       500:
 *         description: Sunucu hatası.
 */

router.post("/kayit", ogrenciKaydetEmail);

module.exports = router;
