const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { ogrenciKaydet } = require("../controllers/ogrenciController");

/**
 * @swagger
 * /api/ogrenci/kayit:
 *   post:
 *     summary: Yeni bir öğrenci kaydı oluşturur
 *     tags:
 *       - Öğrenci
 *     security:
 *       - bearerAuth: []  # Auth eklendiğini belirt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - universiteId
 *               - bolumId
 *             properties:
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
 *         description: Giriş hatası veya geçersiz veri.
 *       403:
 *         description: Yetkisiz işlem. Sadece üniversite öğrencileri kayıt olabilir.
 *       404:
 *         description: Kullanıcı veya bölüm bulunamadı.
 *       500:
 *         description: Sunucu hatası.
 */

router.post("/kayit", auth, ogrenciKaydet);

module.exports = router;
