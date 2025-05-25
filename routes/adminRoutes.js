const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticate = require("../middleware/authMiddleware"); // JWT doğrulama
const isAdminOrSuperUser = require("../middleware/isAdminOrSuperUser");
const isAdmin = require("../middleware/isAdmin");
const isSuperUser = require("../middleware/isSuperUser");
/**
 * @swagger
 * /api/admin/forum/{id}:
 *   delete:
 *     summary: Admin veya SuperUser tarafından forum silme
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Silinecek forumun ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Forum başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedForum:
 *                   type: object
 *       403:
 *         description: Yetkisiz - Sadece admin veya superUser erişebilir
 *       404:
 *         description: Forum bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.delete(
  "/forum/:id",
  authenticate,
  isAdminOrSuperUser,
  adminController.deleteForum
);

/**
 * @swagger
 * /api/admin/entry/{id}:
 *   delete:
 *     summary: Admin veya SuperUser tarafından entry silme
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Silinecek entry'nin ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entry başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedEntry:
 *                   type: object
 *       403:
 *         description: Yetkisiz - Sadece admin veya superUser erişebilir
 *       404:
 *         description: Entry bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.delete(
  "/entry/:id",
  authenticate,
  isAdminOrSuperUser,
  adminController.deleteEntry
);

/**
 * @swagger
 * /api/admin/soru/{id}:
 *   delete:
 *     summary: Admin veya SuperUser tarafından soru silme
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Silinecek soru'nun ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Soru başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedSoru:
 *                   type: object
 *       403:
 *         description: Yetkisiz - Sadece admin veya superUser erişebilir
 *       404:
 *         description: Soru bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.delete(
  "/soru/:id",
  authenticate,
  isAdminOrSuperUser,
  adminController.deleteSoru
);

/**
 * @swagger
 * /api/admin/cevap/{id}:
 *   delete:
 *     summary: Admin veya SuperUser tarafından cevap silme
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Silinecek cevap'in ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cevap başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedCevap:
 *                   type: object
 *       403:
 *         description: Yetkisiz - Sadece admin veya superUser erişebilir
 *       404:
 *         description: Cevap bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.delete(
  "/cevap/:id",
  authenticate,
  isAdminOrSuperUser,
  adminController.deleteCevap
);

/**
 * @swagger
 * /api/admin/grup/{id}:
 *   delete:
 *     summary: Admin veya SuperUser tarafından grup silme
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Silinecek grup'un ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grup başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedCevap:
 *                   type: object
 *       403:
 *         description: Yetkisiz - Sadece admin veya superUser erişebilir
 *       404:
 *         description: Grup bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.delete(
  "/grup/:id",
  authenticate,
  isAdminOrSuperUser,
  adminController.deleteGrup
);

/**
 * @swagger
 * /api/admin/bolum/aktifMi/{bolumId}:
 *   put:
 *     summary: Admin veya SuperUser tarafından bölümün aktiflik durumunun güncellenmesi (true/false)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bolumId
 *         required: true
 *         description: Güncellenecek bölümün ID'si
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aktifMi:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Bölümün aktiflik durumu başarıyla güncellendi veya zaten o durumdaydı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Geçersiz veri (aktifMi boolean değil)
 *       404:
 *         description: Fakülte bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.put(
  "/bolum/aktifMi/:bolumId",
  authenticate,
  isAdminOrSuperUser,
  adminController.guncelleBolumAktiflik
);

/**
 * @swagger
 * /api/admin/fakulte/aktifMi/{fakulteId}:
 *   put:
 *     summary: Admin veya SuperUser tarafından fakültenin aktiflik durumunun güncellenmesi (true/false)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fakulteId
 *         required: true
 *         description: Güncellenecek fakültenin ID'si
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aktifMi:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Fakülte aktiflik durumu başarıyla güncellendi veya zaten o durumdaydı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Geçersiz veri (aktifMi boolean değil)
 *       404:
 *         description: Fakülte bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

router.put(
  "/fakulte/aktifMi/:fakulteId",
  authenticate,
  isAdminOrSuperUser,
  adminController.guncelleFakulteAktiflik
);

/**
 * @swagger
 * /api/admin/kullanici/aktifMi/{kullaniciId}:
 *   put:
 *     summary: Admin veya SuperUser tarafından kullanıcının aktiflik durumunu güncelleme (true/false)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kullaniciId
 *         required: true
 *         description: Güncellenecek kullanıcının ID'si
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aktifMi:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Kullanıcı aktiflik durumu başarıyla güncellendi veya zaten o durumdaydı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Geçersiz veri (aktifMi boolean değil)
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.put(
  "/kullanici/aktifMi/:kullaniciId",
  authenticate,
  isAdminOrSuperUser,
  adminController.guncelleKullaniciAktiflik
);

/**
 * @swagger
 * /api/admin/kullanici/listele:
 *   get:
 *     summary: Admin ve SuperUser onaylı hesapları (Aday öğrenci, Üniversite öğrencisi, Mezun) türlerdeki kullanıcıları listeler
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: kullaniciAdi
 *         schema:
 *           type: string
 *         required: false
 *         description: Kullanıcı adı ile arama yapar
 *     responses:
 *       200:
 *         description: Başarılı istek - kullanıcılar listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: object
 *                     properties:
 *                       kullaniciid:
 *                         type: integer
 *                         example: 1
 *                       ad:
 *                         type: string
 *                         example: Naz
 *                       soyad:
 *                         type: string
 *                         example: Hacıhafızoğlu
 *                       kullaniciadi:
 *                         type: string
 *                         example: nazhhoglu
 *                       email:
 *                         type: string
 *                         example: nazhacihafizoglu@gmail.com
 *                       kullanicituruid:
 *                         type: integer
 *                         example: 1
 *                       puan:
 *                         type: integer
 *                         example: 0
 *                       aktifmi:
 *                         type: boolean
 *                         example: true
 *                       onaylandimi:
 *                         type: boolean
 *                         example: true
 *                       olusturmatarihi:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-15T22:40:06.080Z
 *                       kullaniciTuruId:
 *                         type: integer
 *                         example: 1
 *                       kullanicirolu:
 *                         type: string
 *                         example: Aday Öğrenci
 *       500:
 *         description: Sunucu hatası
 */
router.get(
  "/kullanici/listele",
  authenticate,
  isAdminOrSuperUser,
  adminController.kullaniciListeleme
);

/**
 * @swagger
 * /api/admin/kullanici/mezunListele:
 *   get:
 *     summary: Admin ve SuperUser onaylanmış ve kullanıcı türü mezun (3) olan kullanıcıları listeler
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: kullaniciAdi
 *         schema:
 *           type: string
 *         required: false
 *         description: Kullanıcı adına göre filtreleme yapar
 *     responses:
 *       200:
 *         description: Başarılı istek - mentor kullanıcılar listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: object
 *                     properties:
 *                       kullaniciid:
 *                         type: integer
 *                         example: 5
 *                       ad:
 *                         type: string
 *                         example: Ahmet
 *                       soyad:
 *                         type: string
 *                         example: Kara
 *                       kullaniciadi:
 *                         type: string
 *                         example: ahmetk
 *                       email:
 *                         type: string
 *                         example: ahmet@gmail.com
 *                       kullanicituruid:
 *                         type: integer
 *                         example: 3
 *                       puan:
 *                         type: integer
 *                         example: 20
 *                       aktifmi:
 *                         type: boolean
 *                         example: true
 *                       onaylandimi:
 *                         type: boolean
 *                         example: true
 *                       olusturmatarihi:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-01T10:15:00.000Z
 *                       kullaniciTuruId:
 *                         type: integer
 *                         example: 3
 *                       kullanicirolu:
 *                         type: string
 *                         example: Mentor
 *       500:
 *         description: Sunucu hatası
 */
router.get(
  "/kullanici/mezunListele",
  authenticate,
  isAdminOrSuperUser,
  adminController.mezunListeleme
);

/**
 * @swagger
 * /api/admin/adminOner:
 *   post:
 *     summary: Adminler başka bir kullanıcıyı admin olarak önerebilir
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - onerilenKullaniciId
 *             properties:
 *               onerilenKullaniciId:
 *                 type: integer
 *                 example: 12
 *                 description: Admin olarak önerilen kullanıcının ID'si
 *     responses:
 *       201:
 *         description: Admin önerisi başarıyla yapıldı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin önerisi başarıyla yapıldı.
 *       400:
 *         description: Hatalı istek (kendini önermeye çalışma, tekrar önerme vb.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bu kullanıcı için zaten bekleyen bir öneriniz var.
 *       404:
 *         description: Önerilen kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Önerilen kullanıcı bulunamadı.
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sunucu hatası.
 */
router.post("/adminOner", authenticate, isAdmin, adminController.adminOner);

/**
 * @swagger
 * /api/admin/bekleyenOneriler:
 *   get:
 *     summary: SuperUser beklemede olan admin önerilerini listeler
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bekleyen admin önerileri başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   oneriId:
 *                     type: integer
 *                     example: 1
 *                   onerenKullaniciAdi:
 *                     type: string
 *                     example: "mehmet123"
 *                   onerilenKullaniciAdi:
 *                     type: string
 *                     example: "ayse_mentor"
 *                   oneriTarihi:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-21T14:30:00.000Z"
 *       500:
 *         description: Sunucu hatası
 */
router.get(
  "/bekleyenOneriler",
  authenticate,
  isSuperUser,
  adminController.bekleyenAdminOnerileri
);

/**
 * @swagger
 * /api/admin/superUserKarar:
 *   post:
 *     summary: Super user tarafından bir öneriye karar ver.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oneriId
 *               - karar
 *             properties:
 *               oneriId:
 *                 type: integer
 *                 example: 5
 *               karar:
 *                 type: string
 *                 enum: [Onaylandi, Reddedildi]
 *                 example: Onaylandi
 *     responses:
 *       201:
 *         description: Karar başarıyla eklendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mesaj:
 *                   type: string
 *                 karar:
 *                   type: object
 *       400:
 *         description: Geçersiz istek verisi.
 *       500:
 *         description: Sunucu hatası.
 */
router.post(
  "/superUserKarar",
  authenticate,
  isSuperUser,
  adminController.superUserKararEkle
);

/**
 * @swagger
 * /api/admin/kullanici/adminListele:
 *   get:
 *     summary: Admin ve SuperUser kullanıcı türü admin (4) olan kullanıcıları listeler
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: kullaniciAdi
 *         schema:
 *           type: string
 *         required: false
 *         description: Kullanıcı adına göre filtreleme yapar
 *     responses:
 *       200:
 *         description: Başarılı istek - admin kullanıcılar listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: object
 *                     properties:
 *                       kullaniciid:
 *                         type: integer
 *                         example: 5
 *                       ad:
 *                         type: string
 *                         example: Ahmet
 *                       soyad:
 *                         type: string
 *                         example: Kara
 *                       kullaniciadi:
 *                         type: string
 *                         example: ahmetk
 *                       email:
 *                         type: string
 *                         example: ahmet@gmail.com
 *                       kullanicituruid:
 *                         type: integer
 *                         example: 3
 *                       puan:
 *                         type: integer
 *                         example: 20
 *                       aktifmi:
 *                         type: boolean
 *                         example: true
 *                       onaylandimi:
 *                         type: boolean
 *                         example: true
 *                       olusturmatarihi:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-01T10:15:00.000Z
 *                       kullaniciTuruId:
 *                         type: integer
 *                         example: 3
 *                       kullanicirolu:
 *                         type: string
 *                         example: Admin
 *       500:
 *         description: Sunucu hatası
 */
router.get(
  "/kullanici/adminListele",
  authenticate,
  isAdminOrSuperUser,
  adminController.adminListeleme
);

/**
 * @swagger
 * /api/admin/dogrudanAdmin:
 *   post:
 *     summary: SuperUser, bir kullanıcıyı doğrudan admin yapar.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kullaniciId
 *             properties:
 *               kullaniciId:
 *                 type: integer
 *                 example: 8
 *     responses:
 *       200:
 *         description: Kullanıcı admin yapıldı.
 *       400:
 *         description: Eksik veya hatalı veri.
 *       404:
 *         description: Kullanıcı bulunamadı.
 *       500:
 *         description: Sunucu hatası.
 */
router.post(
  "/dogrudanAdmin",
  authenticate,
  isSuperUser,
  adminController.dogrudanAdminYap
);

/**
 * @swagger
 * /api/admin/adminliktenCikarma:
 *   post:
 *     summary: SuperUser, bir kullanıcıyı adminlikten alır.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kullaniciId
 *             properties:
 *               kullaniciId:
 *                 type: integer
 *                 example: 8
 *     responses:
 *       200:
 *         description: Kullanıcı adminlikten alındı.
 *       400:
 *         description: Eksik veya hatalı veri.
 *       404:
 *         description: Kullanıcı bulunamadı.
 *       500:
 *         description: Sunucu hatası.
 */
router.post(
  "/adminliktenCikarma",
  authenticate,
  isSuperUser,
  adminController.adminliktenCikarma
);

/**
 * @swagger
 * /api/admin/adminliktenAyril:
 *   post:
 *     summary: Kullanıcının adminlikten ayrılması
 *     description: Giriş yapmış kullanıcı admin rolünden çıkarılır ve kullanıcı türü "3" olarak güncellenir.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Adminlikten ayrılma başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mesaj:
 *                   type: string
 *                   example: Adminlikten ayrılma işlemi başarılı.
 *                 kullanici:
 *                   type: object
 *                   properties:
 *                     kullaniciId:
 *                       type: integer
 *                       example: 12
 *                     ad:
 *                       type: string
 *                       example: Ahmet
 *                     soyad:
 *                       type: string
 *                       example: Yılmaz
 *                     email:
 *                       type: string
 *                       example: ahmet@example.com
 *                     kullaniciTuruId:
 *                       type: integer
 *                       example: 3
 *       500:
 *         description: Adminlikten ayrılma işlemi sırasında sunucu hatası oluştu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mesaj:
 *                   type: string
 *                   example: Adminlikten ayrılma işlemi başarısız.
 */
router.post(
  "/adminliktenAyril",
  authenticate,
  adminController.adminliktenAyril
);

/**
 * @swagger
 * /api/admin/fakulteEkle:
 *   post:
 *     summary: Yeni bir fakülte ekle
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ad
 *               - universiteId
 *             properties:
 *               ad:
 *                 type: string
 *                 example: Mühendislik Fakültesi
 *               universiteId:
 *                 type: integer
 *                 example: 1
 *               aktifMi:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Fakülte başarıyla eklendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fakulteId:
 *                   type: integer
 *                 ad:
 *                   type: string
 *                 universiteId:
 *                   type: integer
 *                 aktifMi:
 *                   type: boolean
 *       400:
 *         description: Eksik alanlar
 *       500:
 *         description: Sunucu hatası
 */
router.post(
  "/fakulteEkle",
  authenticate,
  isSuperUser,
  adminController.fakulteEkle
);

/**
 * @swagger
 * /api/admin/bolumEkle:
 *   post:
 *     summary: Yeni bir bölüm ekle
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ad
 *               - universiteId
 *               - fakulteId
 *             properties:
 *               ad:
 *                 type: string
 *                 example: Bilgisayar Mühendisliği
 *               universiteId:
 *                 type: integer
 *                 example: 1
 *               fakulteId:
 *                 type: integer
 *                 example: 2
 *               aktifMi:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Bölüm başarıyla eklendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bolumId:
 *                   type: integer
 *                 ad:
 *                   type: string
 *                 universiteId:
 *                   type: integer
 *                 fakulteId:
 *                   type: integer
 *                 aktifMi:
 *                   type: boolean
 *       400:
 *         description: Eksik alanlar
 *       500:
 *         description: Sunucu hatası
 */
router.post("/bolumEkle", authenticate, isSuperUser, adminController.bolumEkle);

module.exports = router;
