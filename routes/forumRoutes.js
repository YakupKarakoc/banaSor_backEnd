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
  forumDetayGetir,
  universiteForumGetir,
  entryTepkiEkleGuncelle,
} = require("../controllers/forumController");

/**
 * @swagger
 * /api/forum/forumEkle:
 *   post:
 *     summary: Forum oluşturma
 *     description: Yeni bir forum oluşturur. Sadece aktif kullanıcılar forum oluşturabilir.
 *     tags:
 *       - Forum
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - baslik
 *               - universiteId
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
 *                 olusturanId:
 *                   type: integer
 *                 baslik:
 *                   type: string
 *                 universiteId:
 *                   type: integer
 *                 olusturmaTarihi:
 *                   type: string
 *                   format: date-time
 *       403:
 *         description: Hesabınız pasif durumda. Forum oluşturamazsınız.
 *       500:
 *         description: Forum oluşturulamadı
 */

router.post("/forumEkle", auth, forumEkle);

/**
 * @swagger
 * /api/forum/forumGuncelle:
 *   patch:
 *     summary: Forum başlığını güncelle
 *     description: Kullanıcıya ait forumun başlığını günceller. Sadece aktif kullanıcılar işlem yapabilir.
 *     tags:
 *       - Forum
 *     security:
 *       - bearerAuth: []
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
 *         description: Başlığı güncelleme yetkisi yok veya kullanıcı pasif durumda
 *       500:
 *         description: Başlık güncellenemedi
 */

router.patch("/forumGuncelle", auth, forumGuncelle);

/**
 * @swagger
 * /api/forum/forumSil:
 *   delete:
 *     summary: Forum sil
 *     description: Kullanıcıya ait foruma ait veriyi siler. Hesabı pasif olan kullanıcılar bu işlemi yapamaz.
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
 *         description: Hesabınız pasif durumda, işlem yapılamaz
 *       404:
 *         description: Forum bulunamadı
 *       500:
 *         description: Forum silinemedi
 */
router.delete("/forumSil", auth, forumSil);

/**
 * @swagger
 * /api/forum/entryEkle:
 *   post:
 *     summary: Entry ekleme
 *     description: Belirli bir foruma entry ekler. Yalnızca aktif kullanıcılar entry ekleyebilir.
 *     tags:
 *       - Forum
 *     security:
 *       - bearerAuth: []
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
 *       403:
 *         description: Pasif kullanıcı entry ekleyemez.
 *       500:
 *         description: Entry eklenemedi
 */

router.post("/entryEkle", auth, entryEkle);

/**
 * @swagger
 * /api/forum/entryGuncelle:
 *   patch:
 *     summary: Entry içeriğini güncelle
 *     description: Kullanıcıya ait entry'nin içeriğini günceller. Pasif kullanıcılar işlem yapamaz.
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
 *         description: Kullanıcı pasif veya entry bu kullanıcıya ait değil
 *       500:
 *         description: İçerik güncellenemedi
 */
router.patch("/entryGuncelle", auth, entryGuncelle);

/**
 * @swagger
 * /api/forum/entrySil:
 *   delete:
 *     summary: Entry sil
 *     description: Kullanıcıya ait entry'yi siler. Kullanıcının aktif olması gerekmektedir.
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
 *         description: Hesabınız pasif durumda, işlem yapılamaz veya Yetkisiz işlem
 *       404:
 *         description: Entry bulunamadı
 *       500:
 *         description: Server hatası
 */
router.delete("/entrySil", auth, entrySil);

/**
 * @swagger
 * /api/forum/detay/{forumId}:
 *   get:
 *     summary: Belirli bir foruma ait detayları ve yazılan entry'leri getirir
 *     tags:
 *       - Forum
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Detayları alınacak forumun ID'si
 *     responses:
 *       200:
 *         description: Forum detayları ve entry'ler başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forumId:
 *                   type: integer
 *                   example: 3
 *                 baslik:
 *                   type: string
 *                   example: Bilgisayar mühendisliği 1. sınıf kitap önerisi
 *                 olusturmaTarihi:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-04-28T12:00:00.000Z
 *                 olusturanKullaniciAdi:
 *                   type: string
 *                   example: yazilimci_ahmet
 *                 universite:
 *                   type: string
 *                   example: Boğaziçi Üniversitesi
 *                 entrySayisi:
 *                   type: integer
 *                   example: 5
 *                 entryler:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       entryId:
 *                         type: integer
 *                         example: 101
 *                       icerik:
 *                         type: string
 *                         example: Veri yapıları dersi için Cormen kitabını öneririm.
 *                       olusturmaTarihi:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-28T12:45:00.000Z
 *                       kullaniciAdi:
 *                         type: string
 *                         example: ali_dev
 *                       likeSayisi:
 *                         type: integer
 *                         example: 8
 *                       dislikeSayisi:
 *                         type: integer
 *                         example: 2
 *       404:
 *         description: Forum bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.get("/detay/:forumId", forumDetayGetir);

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

/**
 * @swagger
 * /api/forum/entry/tepki:
 *   post:
 *     summary: Entry'e Like/Dislike ekle, değiştir veya geri çek
 *     description: |
 *       - Eğer kullanıcı daha önce tepki vermemişse: Like/Dislike ekler.
 *       - Aynı tepkiye tekrar basarsa: Tepkiyi geri çeker (silme).
 *       - Farklı bir tepki verirse: Tepkiyi günceller.
 *
 *       **Puan sistemi:**
 *       - Like eklendiğinde entry sahibinin puanı +2 artar.
 *       - Like geri çekildiğinde entry sahibinin puanı -2 azalır.
 *       - Dislike puan üzerinde değişiklik yapmaz.
 *       - Dislike -> Like dönüşümünde puan +2 artar.
 *       - Like -> Dislike dönüşümünde puan -2 azalır.
 *
 *       **Kullanıcı Durumu:**
 *       - Pasif hesaplar tepki veremez.
 *       - Pasif hesaplardan tepki işlemi engellenir ve `403` hatası döndürülür.
 *     tags: [Tepkiler]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entryId
 *               - tepki
 *             properties:
 *               entryId:
 *                 type: integer
 *                 description: Tepki verilecek entry'nin ID'si
 *                 example: 27
 *               tepki:
 *                 type: string
 *                 enum: [Like, Dislike]
 *                 description: Verilecek tepki türü
 *                 example: Like
 *     responses:
 *       200:
 *         description: Tepki eklendi, güncellendi veya geri çekildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tepki kaydedildi
 *       400:
 *         description: Geçersiz tepki türü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Geçersiz tepki türü
 *       403:
 *         description: Hesap pasif olduğu için tepki verilemez
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hesabınız pasif durumda, işlem yapılamaz
 *       404:
 *         description: Entry bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Entry bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.post("/entry/tepki", auth, entryTepkiEkleGuncelle);

module.exports = router;
