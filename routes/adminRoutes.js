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

module.exports = router;
