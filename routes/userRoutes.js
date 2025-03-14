const express = require("express");
const { getProfile } = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Kullanıcı işlemleri
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Kullanıcı profilini getir
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri döner
 *       401:
 *         description: Yetkisiz erişim
 */
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
