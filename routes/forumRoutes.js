const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  forumEkle,
  forumGuncelle,
  forumSil,
  entryEkle,
  entryGuncelle,
  entrySil,
  forumlariGetir,
  universiteForumGetir,
} = require("../controllers/forumController");

/**
 * @swagger
 * /api/forum/forumEkle:
 *   post:
 *     summary: Forum oluşturma
 *     description: Yeni bir forum oluşturur.
 *     tags:
 *       - Forum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               baslik:
 *                 type: string
 *                 description: Forum başlığı
 *               universiteId:
 *                 type: integer
 *                 description: Forumun ait olduğu üniversite ID'si
 *     responses:
 *       201:
 *         description: Forum başarıyla oluşturuldu.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forumId:
 *                   type: integer
 *                   description: Oluşturulan forum ID'si
 *                 olusturanId:
 *                   type: integer
 *                   description: Forumun oluşturan kullanıcının ID'si
 *                 baslik:
 *                   type: string
 *                   description: Forum başlığı
 *                 universiteId:
 *                   type: integer
 *                   description: Forumun ait olduğu üniversite ID'si
 *                 olusturmaTarihi:
 *                   type: string
 *                   format: date-time
 *                   description: Forum oluşturulma tarihi
 *       500:
 *         description: Forum oluşturulamadı
 */
router.post("/forumEkle", auth, forumEkle);

/**
 * @swagger
 * /api/forum/forumGuncelle:
 *   patch:
 *     summary: Forum başlığını güncelle
 *     description: Kullanıcıya ait forumun başlığını günceller.
 *     tags:
 *       - Forum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - forumId
 *               - yeniBaslik
 *             properties:
 *               forumId:
 *                 type: integer
 *                 description: Güncellenecek forumun ID'si
 *               yeniBaslik:
 *                 type: string
 *                 description: Yeni başlık
 *     responses:
 *       200:
 *         description: Başlık başarıyla güncellendi
 *       403:
 *         description: Başlığı güncelleme yetkisi yok
 *       500:
 *         description: Başlık güncellenemedi
 */
router.patch("/forumGuncelle", auth, forumGuncelle);

/**
 * @swagger
 * /api/forum/forumSil:
 *   delete:
 *     summary: Forum sil
 *     description: Kullanıcıya ait foruma ait veriyi siler.
 *     tags:
 *       - Forum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - forumId
 *             properties:
 *               forumId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Forum başarıyla silindi
 *       403:
 *         description: Yetkisiz işlem
 */
router.delete("/forumSil", auth, forumSil);

/**
 * @swagger
 * /api/forum/entryEkle:
 *   post:
 *     summary: Entry ekleme
 *     description: Belirli bir foruma entry ekler.
 *     tags:
 *       - Forum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - forumId
 *               - icerik
 *             properties:
 *               forumId:
 *                 type: integer
 *                 description: Entry'nin ekleneceği forumun ID'si
 *               icerik:
 *                 type: string
 *                 description: Entry içeriği
 *     responses:
 *       201:
 *         description: Entry başarıyla eklendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entryId:
 *                   type: integer
 *                   description: Eklenen entry ID'si
 *                 forumId:
 *                   type: integer
 *                   description: Forum ID'si
 *                 kullaniciId:
 *                   type: integer
 *                   description: Entry'yi ekleyen kullanıcının ID'si
 *                 icerik:
 *                   type: string
 *                   description: Entry içeriği
 *                 olusturmaTarihi:
 *                   type: string
 *                   format: date-time
 *                   description: Entry oluşturulma tarihi
 *       500:
 *         description: Entry eklenemedi
 */

router.post("/entryEkle", auth, entryEkle);

/**
 * @swagger
 * /api/forum/entryGuncelle:
 *   patch:
 *     summary: Entry içeriğini güncelle
 *     description: Kullanıcıya ait entry'nin içeriğini günceller.
 *     tags:
 *       - Forum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entryId
 *               - yeniIcerik
 *             properties:
 *               entryId:
 *                 type: integer
 *                 description: Güncellenecek entry'nin ID'si
 *               yeniIcerik:
 *                 type: string
 *                 description: Yeni entry içeriği
 *     responses:
 *       200:
 *         description: İçerik başarıyla güncellendi
 *       403:
 *         description: İçeriği güncelleme yetkisi yok
 *       500:
 *         description: İçerik güncellenemedi
 */
router.patch("/entryGuncelle", auth, entryGuncelle);

/**
 * @swagger
 * /api/forum/entrySil:
 *   delete:
 *     summary: Entry sil
 *     description: Kullanıcıya ait entry'yi siler.
 *     tags:
 *       - Forum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entryId
 *             properties:
 *               entryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Entry başarıyla silindi
 *       403:
 *         description: Yetkisiz işlem
 */
router.delete("/entrySil", auth, entrySil);

/**
 * @swagger
 * /api/forum/getir:
 *   get:
 *     summary: Forumları listele
 *     description: Forumları listeler. İstenirse üniversiteId'ye göre filtrelenebilir. Her forum için entry sayısı, başlığı açan kullanıcının adı ve üniversite adı da döner.
 *     tags:
 *       - Forum
 *     parameters:
 *       - in: query
 *         name: universiteId
 *         required: false
 *         description: Filtrelemek istenilen Üniversite ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Forumlar başarıyla listelendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   forumId:
 *                     type: integer
 *                   baslik:
 *                     type: string
 *                   olusturanKullaniciAdi:
 *                     type: string
 *                   universiteAdi:
 *                     type: string
 *                   olusturmaTarihi:
 *                     type: string
 *                     format: date-time
 *                   entrySayisi:
 *                     type: integer
 *       500:
 *         description: Forumlar getirilemedi.
 */
router.get("/getir", forumlariGetir);

/**
 * @swagger
 * /api/forum/getir/universite:
 *   get:
 *     summary: Forumları getirir
 *     description: Tüm forumları veya verilen üniversiteId'ye göre filtrelenmiş forumları listeler. Her forum için başlığı açan kullanıcının adı, üniversite adı ve entry sayısı döner.
 *     tags:
 *       - Forum
 *     parameters:
 *       - in: query
 *         name: universiteId
 *         schema:
 *           type: integer
 *         description: Filtrelemek için üniversite ID'si (opsiyonel)
 *     responses:
 *       200:
 *         description: Forumlar başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   forumId:
 *                     type: integer
 *                     description: Forum ID
 *                   baslik:
 *                     type: string
 *                     description: Forum başlığı
 *                   olusturmaTarihi:
 *                     type: string
 *                     format: date-time
 *                     description: Forum oluşturulma tarihi (İstanbul saati)
 *                   kullaniciId:
 *                     type: integer
 *                     description: Forum başlığını açan kullanıcının ID'si
 *                   kullaniciAdi:
 *                     type: string
 *                     description: Forum başlığını açan kullanıcının kullanıcı adı
 *                   universiteAd:
 *                     type: string
 *                     description: Forumun bağlı olduğu üniversite adı
 *                   entrySayisi:
 *                     type: integer
 *                     description: Forumda yazılan entry sayısı
 *       500:
 *         description: Forumlar getirilemedi.
 */
router.get("/getir/universite", universiteForumGetir);

module.exports = router;
