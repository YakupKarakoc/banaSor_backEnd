module.exports = (req, res, next) => {
  const userRole = req.user.kullaniciTuruId; // JWT'den gelen kullanıcı bilgisi

  if (userRole === 4) {
    next();
  } else {
    return res.status(403).json({
      message: "Yetkisiz işlem. Bu işlem sadece admin tarafından yapılabilir.",
    });
  }
};
