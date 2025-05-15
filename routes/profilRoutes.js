const express = require("express");
const {
  kullaniciSorulariGetir,
  profilGuncelle,
  kullaniciCevaplariGetir,
  kullaniciForumlariGetir,
  kullaniciEntryleriGetir,
  begenilenSorulariGetir,
  olusturdugumGruplar,
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
 * /api/profil/forumlarim:
 *   get:
 *     summary: Giriş yapan kullanıcının oluşturduğu forum başlıklarını getirir
 *     tags:
 *       - Profil
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcının oluşturduğu forumlar başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   forumId:
 *                     type: integer
 *                     example: 1
 *                   baslik:
 *                     type: string
 *                     example: Bilgisayar Mühendisliği hakkında ne düşünüyorsunuz?
 *                   olusturmaTarihi:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-04-28T09:15:00.000Z
 *                   universiteAd:
 *                     type: string
 *                     example: İstanbul Teknik Üniversitesi
 *                   entrySayisi:
 *                     type: integer
 *                     example: 3
 *       401:
 *         description: Yetkisiz - Geçerli bir token gerekli
 *       500:
 *         description: Sunucu hatası
 */
router.get("/forumlarim", auth, kullaniciForumlariGetir);

/**
 * @swagger
 * /api/profil/entrylerim:
 *   get:
 *     summary: Giriş yapan kullanıcının yazdığı entry'leri getirir
 *     tags:
 *       - Profil
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcının entry'leri başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   entryId:
 *                     type: integer
 *                     example: 5
 *                   forumId:
 *                     type: integer
 *                     example: 2
 *                   forumBaslik:
 *                     type: string
 *                     example: Yazılım Mühendisliği 1. sınıf önerileriniz
 *                   icerik:
 *                     type: string
 *                     example: Bence ilk yıl algoritma temeli çok önemli.
 *                   olusturmaTarihi:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-04-28T11:05:00.000Z
 *                   likeSayisi:
 *                     type: integer
 *                     example: 10
 *                   dislikeSayisi:
 *                     type: integer
 *                     example: 2
 *       401:
 *         description: Yetkisiz - Geçerli bir token gerekli
 *       500:
 *         description: Sunucu hatası
 */
router.get("/entrylerim", auth, kullaniciEntryleriGetir);

/**
 * @swagger
 * /api/profil/soru/begenilenler:
 *   get:
 *     summary: Giriş yapan kullanıcının beğendiği soruları getirir
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Beğenilen sorular başarıyla getirildi
 *       500:
 *         description: Sunucu hatası
 */
router.get("/soru/begenilenler", auth, begenilenSorulariGetir);

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
 *               aktifMi:
 *                 type: boolean
 *                 example: false
 *             required:
 *               - ad
 *               - soyad
 *               - sifre
 *               - kullaniciAdi
 *               - aktifMi
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
 *                     aktifMi:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Yetkisiz - Token eksik
 *       403:
 *         description: Yetkisiz - Token geçersiz
 *       500:
 *         description: Sunucu hatası
 */

router.put("/guncelle", auth, profilGuncelle);

/**
 * @swagger
 * /api/profil/olusturdugumGruplar:
 *   get:
 *     summary: Kullanıcının oluşturduğu grupları ve üye sayılarını listeler
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcının oluşturduğu gruplar listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gruplar:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       grupId:
 *                         type: integer
 *                       ad:
 *                         type: string
 *                       olusturmaTarihi:
 *                         type: string
 *                         format: date-time
 *                       uyeSayisi:
 *                         type: integer
 *       403:
 *         description: Pasif kullanıcılar işlem yapamaz
 *       500:
 *         description: Sunucu hatası
 */
router.get("/olusturdugumGruplar", auth, olusturdugumGruplar);

module.exports = router;
