const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticate = require("../middleware/authMiddleware"); // JWT doğrulama
const isAdminOrSuperUser = require("../middleware/isAdminOrSuperUser");

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
 *     summary: Kullanıcının aktiflik durumunu güncelle (true/false)
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

module.exports = router;
