const express = require("express");
const {
  kullaniciSorulariGetir,
  profilGuncelle,
  kullaniciCevaplariGetir,
} = require("../controllers/profilController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/profil/sorularim:
 *   get:
 *     summary: Kullanıcının kendi sorduğu soruları getirir
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcının soruları (cevap ve beğeni sayısıyla birlikte)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   soruId:
 *                     type: integer
 *                   icerik:
 *                     type: string
 *                   olusturmaTarihi:
 *                     type: string
 *                     format: date-time
 *                   universiteAd:
 *                     type: string
 *                   bolumAd:
 *                     type: string
 *                   konuAd:
 *                     type: string
 *                   cevapSayisi:
 *                     type: integer
 *                   begeniSayisi:
 *                     type: integer
 */

router.get("/sorularim", auth, kullaniciSorulariGetir);

/**
 * @swagger
 * /api/profil/cevaplarim:
 *   get:
 *     summary: Giriş yapan kullanıcının verdiği cevapları getirir
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcının verdiği cevaplar listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cevapId:
 *                     type: integer
 *                     description: Cevabın ID'si
 *                   cevapIcerik:
 *                     type: string
 *                     description: Cevabın içeriği
 *                   cevapTarihi:
 *                     type: string
 *                     format: date-time
 *                     description: Cevabın oluşturulma tarihi
 *                   soruId:
 *                     type: integer
 *                     description: Cevap verilen sorunun ID'si
 *                   soruIcerik:
 *                     type: string
 *                     description: Cevap verilen sorunun içeriği
 *                   soranKullaniciAdi:
 *                     type: string
 *                     description: Soruyu soran kullanıcının kullanıcı adı
 *                   likeSayisi:
 *                     type: integer
 *                     description: Cevaba yapılan "Like" sayısı
 *                   dislikeSayisi:
 *                     type: integer
 *                     description: Cevaba yapılan "Dislike" sayısı
 *       401:
 *         description: Yetkisiz - token eksik veya geçersiz
 *       500:
 *         description: Sunucu hatası
 */

router.get("/cevaplarim", auth, kullaniciCevaplariGetir);

/**
 * @swagger
 * /api/profil/guncelle:
 *   put:
 *     summary: Kullanıcı profilini güncelle (email hariç)
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ad:
 *                 type: string
 *                 example: Ahmet
 *               soyad:
 *                 type: string
 *                 example: Kaya
 *               sifre:
 *                 type: string
 *                 example: yenisifre123
 *               kullaniciAdi:
 *                 type: string
 *                 example: ahmetk
 *             required:
 *               - ad
 *               - soyad
 *               - sifre
 *               - kullaniciAdi
 *     responses:
 *       200:
 *         description: Güncelleme başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mesaj:
 *                   type: string
 *                   example: Güncelleme başarılı
 *                 kullanici:
 *                   type: object
 *                   properties:
 *                     kullaniciId:
 *                       type: integer
 *                       example: 1
 *                     ad:
 *                       type: string
 *                       example: Ahmet
 *                     soyad:
 *                       type: string
 *                       example: Kaya
 *                     kullaniciAdi:
 *                       type: string
 *                       example: ahmetk
 *       401:
 *         description: Yetkisiz - Token eksik
 *       403:
 *         description: Yetkisiz - Token geçersiz
 *       500:
 *         description: Sunucu hatası
 */

router.put("/guncelle", auth, profilGuncelle);

module.exports = router;
