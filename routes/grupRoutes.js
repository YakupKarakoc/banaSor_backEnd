const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  katilGrup,
  olusturGrup,
  gruptanCik,
  listeleTumGruplar,
  silGrup,
} = require("../controllers/grupController");

/**
 * @swagger
 * tags:
 *   name: Grup
 *   description: Grup oluşturma ve katılma işlemleri
 */

/**
 * @swagger
 * /api/grup/olustur:
 *   post:
 *     summary: Yeni grup oluştur ve oluşturucuyu gruba üye yap
 *     tags: [Grup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ad
 *             properties:
 *               ad:
 *                 type: string
 *                 description: Oluşturulacak grubun adı
 *     responses:
 *       201:
 *         description: Grup başarıyla oluşturuldu ve oluşturucu gruba üye yapıldı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 grupId:
 *                   type: integer
 *                   description: Oluşturulan grubun ID'si
 *                 ad:
 *                   type: string
 *                   description: Grubun adı
 *                 olusturanId:
 *                   type: integer
 *                   description: Grubu oluşturan kullanıcının ID'si
 *                 olusturmaTarihi:
 *                   type: string
 *                   format: date-time
 *                   description: Grubun oluşturulma tarihi
 *       400:
 *         description: Eksik bilgi (grup adı eksik olabilir)
 *       403:
 *         description: Pasif kullanıcılar grup oluşturamaz
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.post("/olustur", auth, olusturGrup);

/**
 * @swagger
 * /api/grup/katil:
 *   post:
 *     summary: Var olan bir gruba katıl
 *     tags: [Grup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grupId
 *             properties:
 *               grupId:
 *                 type: integer
 *                 description: Katılınacak grubun ID'si
 *     responses:
 *       200:
 *         description: Gruba başarıyla katıldı
 *       400:
 *         description: Hatalı giriş (grupId eksik veya kullanıcı zaten grupta)
 *       403:
 *         description: Pasif kullanıcılar gruba katılamaz
 *       500:
 *         description: Sunucu hatası
 */

router.post("/katil", auth, katilGrup);

/**
 * @swagger
 * /api/grup/grupCik/{grupId}:
 *   delete:
 *     summary: Kullanıcı bir gruptan çıkar
 *     tags: [Grup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: grupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Çıkılmak istenen grubun ID'si
 *     responses:
 *       200:
 *         description: Gruptan başarıyla çıkıldı
 *       400:
 *         description: Eksik veya geçersiz grupId
 *       403:
 *         description: Pasif kullanıcılar işlem yapamaz
 *       404:
 *         description: Kullanıcı gruba üye değil
 *       500:
 *         description: Sunucu hatası
 */
router.delete("/grupCik/:grupId", auth, gruptanCik);

/**
 * @swagger
 * /api/grup/grupList:
 *   get:
 *     summary: Sistemdeki tüm grupları listeler
 *     tags: [Grup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tüm gruplar listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gruplar:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       grupId:
 *                         type: integer
 *                       ad:
 *                         type: string
 *                       olusturmaTarihi:
 *                         type: string
 *                         format: date-time
 *                       kullaniciAdi:
 *                         type: string
 *                         description: Grubu oluşturan kullanıcının kullanıcı adı
 *                       uyeSayisi:
 *                         type: integer
 *       500:
 *         description: Sunucu hatası
 */
router.get("/grupList", auth, listeleTumGruplar);

/**
 * @swagger
 * /api/grup/grupSil/{id}:
 *   delete:
 *     summary: Grup silme işlemi
 *     description: >
 *       Sadece grubu oluşturan kullanıcı grubu silebilir.
 *       Grup 2 üyeye sahipse silinemez.
 *     tags:
 *       - Grup
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek grubun ID'si
 *     responses:
 *       200:
 *         description: Grup başarıyla silindi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Grup başarıyla silindi.
 *       400:
 *         description: Silme işlemi yapılamadı (üye kısıtlaması)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Grup 2 üyeye sahipse silinemez.
 *       403:
 *         description: Yetkisiz işlem. Aktif olmayan kullanıcı veya grubu oluşturan kişi değil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aktif olmayan kullanıcılar işlem yapamaz
 *       404:
 *         description: Grup bulunamadı.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Grup bulunamadı.
 *       401:
 *         description: Yetkilendirme başarısız (JWT token eksik veya geçersiz).
 */

router.delete("/grupSil/:id", auth, silGrup);

module.exports = router;
