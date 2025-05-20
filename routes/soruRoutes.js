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
  universiteSoruGetir,
  fakulteSoruGetir,
  bolumSoruGetir,
  tepkiEkleGuncelle,
  soruBegen,
  soruBegendiMi,
  cevapTepkisi,
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
 *     description: Sadece aktif kullanıcılar soru ekleyebilir.
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
 *       403:
 *         description: Pasif kullanıcılar soru ekleyemez
 *       500:
 *         description: Soru eklenemedi
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
 *       403:
 *         description: Soru güncellenemedi - Kullanıcı aktif değil veya yetkisi yok
 *       500:
 *         description: Soru güncellenemedi
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
 *         description: Bu soruyu silme yetkiniz yok veya hesabınız pasif durumda
 */
router.delete("/soruSil/:id", auth, soruSil);

/**
 * @swagger
 * /api/soru/cevapOlustur:
 *   post:
 *     summary: Bir soruya cevap ver
 *     description: Sadece aktif kullanıcılar tarafından kullanılabilir. Pasif kullanıcılar cevap ekleyemez.
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
 *                 description: Cevap verilecek sorunun ID'si
 *               icerik:
 *                 type: string
 *                 description: Cevap içeriği
 *             required:
 *               - soruId
 *               - icerik
 *     responses:
 *       201:
 *         description: Cevap başarıyla eklendi
 *       403:
 *         description: Pasif kullanıcılar cevap ekleyemez
 *       500:
 *         description: Cevap eklenemedi
 */

router.post("/cevapOlustur", auth, cevapEkle);

/**
 * @swagger
 * /api/soru/cevapGuncelle/{id}:
 *   patch:
 *     summary: Cevap içeriğini güncelle
 *     description: Sadece aktif kullanıcılar kendi cevaplarını güncelleyebilir.
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
 *         description: Cevap başarıyla güncellendi
 *       403:
 *         description: Yetkiniz yok veya kullanıcı pasif
 *       500:
 *         description: Cevap güncellenemedi
 */

router.patch("/cevapGuncelle/:id", auth, cevapGuncelle);

/**
 * @swagger
 * /api/soru/cevapSil/{id}:
 *   delete:
 *     summary: Cevap sil (sadece kendi cevabı, aktif kullanıcı)
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
 *         description: Bu cevabı silme yetkiniz yok veya hesabınız pasif durumda
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
 * /api/soru/getir/universite:
 *   get:
 *     summary: Üniversiteye göre soruları getirir
 *     tags: [Sorular]
 *     description: Belirli bir üniversiteye ait soruları listeler.
 *     parameters:
 *       - in: query
 *         name: universiteId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Soruları listelenecek üniversitenin ID'si
 *     responses:
 *       200:
 *         description: Başarılı bir şekilde sorular listelendi
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
 *       500:
 *         description: Sunucu hatası
 */
router.get("/getir/universite", universiteSoruGetir);

/**
 * @swagger
 * /api/soru/getir/bolum:
 *   get:
 *     summary: Bölüme göre soruları getirir
 *     tags: [Sorular]
 *     description: Belirli bir bölüme ait soruları listeler.
 *     parameters:
 *       - in: query
 *         name: bolumId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Soruları listelenecek bölümün ID'si
 *     responses:
 *       200:
 *         description: Başarılı bir şekilde sorular listelendi
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
 *       500:
 *         description: Sunucu hatası
 */
router.get("/getir/bolum", bolumSoruGetir);

/**
 * @swagger
 * /api/soru/getir/fakulte:
 *   get:
 *     summary: Belirli bir fakülteye ait tüm bölümlerdeki soruları getir
 *     tags: [Sorular]
 *     parameters:
 *       - in: query
 *         name: fakulteId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Fakülte ID
 *     responses:
 *       200:
 *         description: Sorular başarıyla listelendi
 *       400:
 *         description: fakulteId zorunludur
 *       500:
 *         description: Sunucu hatası
 */
router.get("/getir/fakulte", fakulteSoruGetir);

/**
 * @swagger
 * /api/soru/cevap/tepki:
 *   post:
 *     summary: Cevaba Like/Dislike ekle, değiştir veya geri çek
 *     description: |
 *       - Eğer kullanıcı daha önce tepki vermemişse: Like/Dislike ekler.
 *       - Aynı tepkiye tekrar basarsa: Tepkiyi geri çeker (silme).
 *       - Farklı bir tepki verirse: Tepkiyi günceller.
 *
 *       **Puan sistemi:**
 *       - Like eklendiğinde cevap sahibinin puanı +5 artar.
 *       - Like geri çekildiğinde cevap sahibinin puanı -5 azalır.
 *       - Dislike puan üzerinde değişiklik yapmaz.
 *       - Dislike -> Like dönüşümünde puan +5 artar.
 *       - Like -> Dislike dönüşümünde puan -5 azalır.
 *
 *       **Aktif olmayan kullanıcılar için:**
 *       - Eğer kullanıcı pasifse, tepki işlemi gerçekleştirilemez ve `403 Forbidden` hatası döner.
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
 *               - cevapId
 *               - tepki
 *             properties:
 *               cevapId:
 *                 type: integer
 *                 description: Tepki verilecek cevabın ID'si
 *                 example: 42
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
 *         description: Kullanıcı pasif, işlem yapılmaz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kullanıcı pasif, işlem yapılmaz
 *       404:
 *         description: Cevap bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cevap bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.post("/cevap/tepki", auth, tepkiEkleGuncelle);

/**
 * @swagger
 * /api/soru/begeni:
 *   post:
 *     summary: Soruyu beğen veya beğeniyi geri çek (toggle)
 *     description: |
 *       - Eğer kullanıcı daha önce beğenmemişse, beğeni ekler ve soruyu soran kullanıcının puanını 5 artırır.
 *       - Eğer kullanıcı daha önce beğenmişse, beğeniyi geri çeker ve soruyu soran kullanıcının puanını 5 azaltır.
 *       - Kullanıcının aktif olmaması durumunda işlem yapılmaz ve `403 Forbidden` hatası döner.
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
 *       401:
 *         description: Yetkisiz - Token eksik veya geçersiz
 *       403:
 *         description: Kullanıcı pasif - işlem yapılmaz
 *       500:
 *         description: Sunucu hatası
 */

router.post("/begeni", auth, soruBegen);

/**
 * @swagger
 * /api/soru/begeni/{soruId}:
 *   get:
 *     summary: Giriş yapan kullanıcının bu soruyu beğenip beğenmediğini kontrol eder
 *     tags:
 *       - Tepkiler
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: soruId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Beğeni durumu kontrol edilecek sorunun ID'si
 *     responses:
 *       200:
 *         description: Beğeni durumu döndürülür
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 begendiMi:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: JWT doğrulama başarısız
 *       500:
 *         description: Sunucu hatası
 */
router.get("/begeni/:soruId", auth, soruBegendiMi);

/**
 * @swagger
 * /api/soru/cevap/tepki/{cevapId}:
 *   get:
 *     summary: Giriş yapan kullanıcının cevaba verdiği tepkiyi getirir (Like/Dislike/null)
 *     tags:
 *       - Tepkiler
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cevapId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tepkisi kontrol edilecek cevabın ID'si
 *     responses:
 *       200:
 *         description: Kullanıcının verdiği tepki türü (Like, Dislike veya null)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tepki:
 *                   type: string
 *                   example: "Like"
 *                   nullable: true
 *       404:
 *         description: Cevap bulunamadı
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: Sunucu hatası
 */
router.get("/cevap/tepki/:cevapId", auth, cevapTepkisi);

module.exports = router;
