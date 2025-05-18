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

module.exports = router;
