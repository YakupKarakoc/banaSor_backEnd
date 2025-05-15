const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  takipEt,
  takiptenCik,
  takipDurumu,
  getirTakipEdilenler,
  universiteTakipçileriGetir,
} = require("../controllers/takipController");

/**
 * @swagger
 * tags:
 *   name: Üniversite Takip
 *   description: Kullanıcının üniversiteleri takip etmesini sağlayan işlemler
 */

/**
 * @swagger
 * /api/takip/takipEt/{universiteId}:
 *   post:
 *     summary: Belirtilen üniversiteyi takip et
 *     description: |
 *       - Kullanıcı daha önce bu üniversiteyi takip etmemişse, takip edilir.
 *       - Aynı kullanıcı aynı üniversiteyi tekrar takip etmeye çalışırsa işlem yok sayılır.
 *       - **Pasif kullanıcılar takip işlemi yapamaz.**
 *     tags: [Üniversite Takip]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universiteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Takip edilecek üniversitenin ID'si
 *     responses:
 *       200:
 *         description: Takip başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Takip edildi
 *       400:
 *         description: Eksik veya geçersiz veri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Eksik veri
 *       403:
 *         description: Pasif kullanıcı işlem yapamaz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Kullanıcı pasif, takip işlemi yapılamaz
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Sunucu hatası
 */
router.post("/takipEt/:universiteId", auth, takipEt);

/**
 * @swagger
 * /api/takip/takipCik/{universiteId}:
 *   delete:
 *     summary: Belirtilen üniversiteyi takipten çık
 *     tags: [Üniversite Takip]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universiteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Takipten çıkılacak üniversitenin ID'si
 *     responses:
 *       200:
 *         description: Takipten çıkıldı
 *       403:
 *         description: Pasif kullanıcılar takipten çıkamaz
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

router.delete("/takipCik/:universiteId", auth, takiptenCik);

/**
 * @swagger
 * /api/takip/takip-durumu/{universiteId}:
 *   get:
 *     summary: Kullanıcının üniversiteyi takip edip etmediğini kontrol et
 *     tags: [Üniversite Takip]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universiteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Takip durumu kontrol edilecek üniversitenin ID'si
 *     responses:
 *       200:
 *         description: Takip durumu döner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 takipEdiyorMu:
 *                   type: boolean
 *       500:
 *         description: Sunucu hatası
 */
router.get("/takip-durumu/:universiteId", auth, takipDurumu);

/**
 * @swagger
 * /api/takip/takipEdilenler:
 *   get:
 *     summary: Kullanıcının takip ettiği üniversitelerin adlarını ve toplam sayısını getirir
 *     tags: [Üniversite Takip]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Takip edilen üniversiteler ve toplam sayısı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 takipEdilenler:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ad:
 *                         type: string
 *                         example: "Boğaziçi Üniversitesi"
 *                 toplam:
 *                   type: integer
 *                   description: Toplam takip edilen üniversite sayısı
 *                   example: 3
 *       500:
 *         description: Sunucu hatası
 */
router.get("/takipEdilenler", auth, getirTakipEdilenler);

/**
 * @swagger
 * /api/takip/universite/{universiteId}/takipciler:
 *   get:
 *     summary: Belirli bir üniversiteyi takip eden kullanıcı adlarını ve toplam takipçi sayısını getirir
 *     tags: [Üniversite Takip]
 *     parameters:
 *       - in: path
 *         name: universiteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Üniversitenin ID'si
 *     responses:
 *       200:
 *         description: Takipçiler ve toplam sayı döndürüldü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 takipciler:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       kullaniciAd:
 *                         type: string
 *                         example: "kullanici123"
 *                 toplam:
 *                   type: integer
 *                   description: Toplam takipçi sayısı
 *                   example: 5
 *       500:
 *         description: Sunucu hatası
 */
router.get(
  "/universite/:universiteId/takipciler",
  auth,
  universiteTakipçileriGetir
);

module.exports = router;
