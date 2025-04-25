const express = require("express");
const router = express.Router();
const {
  konulariGetir,
  soruEkle,
  soruGuncelle,
  soruSil,
  cevapEkle,
  cevapGuncelle,
  cevapSil,
  sorulariGetir,
  soruDetayGetir,
  tepkiEkleGuncelle,
  soruBegen,
} = require("../controllers/soruController");

const auth = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Sorular
 *   description: Soru ve cevap işlemleri
 */

/**
 * @swagger
 * /api/soru/konu/getir:
 *   get:
 *     summary: Tüm konuları listele (isteğe bağlı arama filtresi ile)
 *     tags: [Konular]
 *     parameters:
 *       - in: query
 *         name: arama
 *         schema:
 *           type: string
 *         description: Konu adında arama yapar (örn. "hazırlık")
 *     responses:
 *       200:
 *         description: Konular listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   konuId:
 *                     type: integer
 *                   ad:
 *                     type: string
 */
router.get("/konu/getir", konulariGetir);

/**
 * @swagger
 * /api/soru/soruOlustur:
 *   post:
 *     summary: Yeni bir soru ekle
 *     tags: [Sorular]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               universiteId:
 *                 type: integer
 *               bolumId:
 *                 type: integer
 *               konuId:
 *                 type: integer
 *               icerik:
 *                 type: string
 *             required:
 *               - icerik
 *     responses:
 *       201:
 *         description: Soru başarıyla eklendi
 *       401:
 *         description: Yetkisiz
 */
router.post("/soruOlustur", auth, soruEkle);

/**
 * @swagger
 * /api/soru/soruGuncelle/{id}:
 *   patch:
 *     summary: Soru içeriğini güncelle
 *     tags: [Sorular]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek soru ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               icerik:
 *                 type: string
 *                 example: Güncellenmiş soru içeriği
 *     responses:
 *       200:
 *         description: Güncellenen soru
 */
router.patch("/soruGuncelle/:id", auth, soruGuncelle);

/**
 * @swagger
 * /api/soru/soruSil/{id}:
 *   delete:
 *     summary: Soru sil (sadece kendi sorusu)
 *     tags: [Sorular]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek sorunun ID'si
 *     responses:
 *       204:
 *         description: Soru silindi
 *       403:
 *         description: Bu soruyu silme yetkiniz yok
 */
router.delete("/soruSil/:id", auth, soruSil);

/**
 * @swagger
 * /api/soru/cevapOlustur:
 *   post:
 *     summary: Bir soruya cevap ver
 *     tags: [Sorular]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soruId:
 *                 type: integer
 *               icerik:
 *                 type: string
 *             required:
 *               - soruId
 *               - icerik
 *     responses:
 *       201:
 *         description: Cevap eklendi
 */
router.post("/cevapOlustur", auth, cevapEkle);

/**
 * @swagger
 * /api/soru/cevapGuncelle/{id}:
 *   patch:
 *     summary: Cevap içeriğini güncelle
 *     tags: [Sorular]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek cevap ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               icerik:
 *                 type: string
 *                 example: Güncellenmiş cevap içeriği
 *     responses:
 *       200:
 *         description: Güncellenen cevap
 */
router.patch("/cevapGuncelle/:id", auth, cevapGuncelle);

/**
 * @swagger
 * /api/soru/cevapSil/{id}:
 *   delete:
 *     summary: Cevap sil (sadece kendi cevabı)
 *     tags: [Sorular]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek cevabın ID'si
 *     responses:
 *       204:
 *         description: Cevap silindi
 *       403:
 *         description: Bu cevabı silme yetkiniz yok
 */
router.delete("/cevapSil/:id", auth, cevapSil);

/**
 * @swagger
 * /api/soru/getir:
 *   get:
 *     summary: Soruları filtrele ve detaylarıyla birlikte listele
 *     tags: [Sorular]
 *     parameters:
 *       - in: query
 *         name: universiteId
 *         schema:
 *           type: integer
 *         description: Üniversite ID'sine göre filtrele
 *       - in: query
 *         name: bolumId
 *         schema:
 *           type: integer
 *         description: Bölüm ID'sine göre filtrele
 *       - in: query
 *         name: konuId
 *         schema:
 *           type: integer
 *         description: Konu ID'sine göre filtrele
 *     responses:
 *       200:
 *         description: Filtrelenmiş sorular listesi (kullanıcı adı, üniversite adı, bölüm adı, konu adı, cevap ve beğeni sayısı ile birlikte)
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
 *                   kullaniciId:
 *                     type: integer
 *                   kullaniciAdi:
 *                     type: string
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
router.get("/getir", sorulariGetir);

/**
 * @swagger
 * /api/soru/detay/{soruId}:
 *   get:
 *     summary: Belirli bir sorunun tüm detaylarını getirir (cevaplarla birlikte)
 *     tags: [Sorular]
 *     parameters:
 *       - in: path
 *         name: soruId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Detayları gösterilecek soru ID'si
 *     responses:
 *       200:
 *         description: Soru detayları ve cevapları
 *         content:
 *           application/json:
 *             example:
 *               soruId: 1
 *               icerik: "Hazırlık var mı?"
 *               olusturmaTarihi: "2025-04-20T21:39:40.474Z"
 *               soranKullaniciAdi: "ayse35"
 *               konu: "Yurt olanakları"
 *               universite: "EGE ÜNİVERSİTESİ"
 *               bolum: "TARİH BÖLÜMÜ"
 *               begeniSayisi: 3
 *               cevaplar:
 *                 - cevapId: 5
 *                   icerik: "Var ama isteğe bağlı"
 *                   olusturmaTarihi: "2025-04-20T21:42:10.000Z"
 *                   cevaplayanKullaniciAdi: "mehmet07"
 *                   likeSayisi: 10
 *                   dislikeSayisi: 1
 */

router.get("/detay/:soruId", soruDetayGetir);

/**
 * @swagger
 * /api/soru/cevap/tepki:
 *   post:
 *     summary: Cevaba like/dislike ekle, değiştir veya geri çek
 *     description:
 *       - Daha önce tepki yoksa: Like/Dislike ekler.
 *       - Aynı tepki tekrar gönderilirse: Tepki geri çekilir (silinir).
 *       - Farklı bir tepki gönderilirse: Önceki tepki güncellenir.
 *     tags: [Tepkiler]
 *     security:
 *       - bearerAuth: []  # Eğer JWT kullanıyorsanız
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cevapId
 *               - tepki
 *             properties:
 *               cevapId:
 *                 type: integer
 *                 example: 42
 *               tepki:
 *                 type: string
 *                 enum: [Like, Dislike]
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
 *       500:
 *         description: Sunucu hatası
 */
router.post("/cevap/tepki", auth, tepkiEkleGuncelle);

/**
 * @swagger
 * /api/soru/begeni:
 *   post:
 *     summary: Soruyu beğen veya beğeniyi geri çek (toggle)
 *     description:
 *       - Eğer kullanıcı daha önce beğenmemişse, beğeni ekler.
 *       - Daha önce beğenmişse, beğeniyi geri çeker.
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
 *               - soruId
 *             properties:
 *               soruId:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       200:
 *         description: Beğeni eklendi veya geri çekildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Soru beğenildi
 *       500:
 *         description: Sunucu hatası
 */

router.post("/begeni", auth, soruBegen);

module.exports = router;
