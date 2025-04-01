// educationRoutes.js
const express = require("express");
const {
  city,
  university,
  faculty,
  department,
} = require("../controllers/educationController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Education
 *   description: Eğitimle ilgili işlemleri gerçekleştirir.
 */

/**
 * @swagger
 * /api/education/city:
 *   get:
 *     tags: [Education]
 *     summary: Şehirleri listeleme ve filtreleme
 *     description: Şehirleri, adıyla filtreleyerek listelemenizi sağlar.
 *     parameters:
 *       - in: query
 *         name: ad
 *         schema:
 *           type: string
 *         description: Şehir adı ile arama yapabilirsiniz.
 *     responses:
 *       200:
 *         description: Başarılı şehir listesi
 */
router.get("/city", city);

/**
 * @swagger
 * /api/education/university:
 *   get:
 *     tags: [Education]
 *     summary: Üniversiteleri listeleme ve filtreleme
 *     description: Üniversiteleri adı, şehir ID ve aktiflik durumuna göre listeleyebilirsiniz.
 *     parameters:
 *       - in: query
 *         name: ad
 *         schema:
 *           type: string
 *         description: Üniversite adı ile arama yapabilirsiniz.
 *       - in: query
 *         name: sehirId
 *         schema:
 *           type: integer
 *         description: Şehir ID ile filtreleyebilirsiniz.
 *       - in: query
 *         name: aktifMi
 *         schema:
 *           type: boolean
 *         description: Üniversitenin aktif olup olmadığını filtreler.
 *     responses:
 *       200:
 *         description: Başarılı üniversite listesi
 */
router.get("/university", university);

/**
 * @swagger
 * /api/education/faculty:
 *   get:
 *     tags: [Education]
 *     summary: Fakülteleri listeleme ve filtreleme
 *     description: Fakülteleri adı, üniversite ID ve aktiflik durumuna göre listeleyebilirsiniz.
 *     parameters:
 *       - in: query
 *         name: ad
 *         schema:
 *           type: string
 *         description: Fakülte adı ile arama yapabilirsiniz.
 *       - in: query
 *         name: universiteId
 *         schema:
 *           type: integer
 *         description: Üniversite ID ile filtreleyebilirsiniz.
 *       - in: query
 *         name: aktifMi
 *         schema:
 *           type: boolean
 *         description: Fakültenin aktif olup olmadığını filtreler.
 *     responses:
 *       200:
 *         description: Başarılı fakülte listesi
 */
router.get("/faculty", faculty);

/**
 * @swagger
 * /api/education/department:
 *   get:
 *     tags: [Education]
 *     summary: Bölümleri listeleme ve filtreleme
 *     description: Bölümleri adı, üniversite ID, fakülte ID ve aktiflik durumuna göre listeleyebilirsiniz.
 *     parameters:
 *       - in: query
 *         name: ad
 *         schema:
 *           type: string
 *         description: Bölüm adı ile arama yapabilirsiniz.
 *       - in: query
 *         name: universiteId
 *         schema:
 *           type: integer
 *         description: Üniversite ID ile filtreleyebilirsiniz.
 *       - in: query
 *         name: fakulteId
 *         schema:
 *           type: integer
 *         description: Fakülte ID ile filtreleyebilirsiniz.
 *       - in: query
 *         name: aktifMi
 *         schema:
 *           type: boolean
 *         description: Bölümün aktif olup olmadığını filtreler.
 *     responses:
 *       200:
 *         description: Başarılı bölüm listesi
 */
router.get("/department", department);

module.exports = router;
