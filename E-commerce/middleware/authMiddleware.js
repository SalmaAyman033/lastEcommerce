const jwt = require('jsonwebtoken');
require('dotenv').config()
const SECRET = process.env.SECRET;
function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) return res.redirect("/api/v1/user/login");
    try {
        const decoded = jwt.verify(token, SECRET);
        req.locals = decoded;
        //console.log(req.locals)
        next();
    } catch (error) {
        return res.redirect("/api/v1/user/login");
    }
};
function verifyAdminToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) return res.redirect("/api/v1/user/login");
    try {
        const decoded = jwt.verify(token, SECRET);
        req.userId = decoded.userId;
        if (decoded.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: 'Unauthorized: Access restricted to admins' });
        }
    } catch (error) {
        return res.redirect("/api/v1/user/login");
    }
};


module.exports = { verifyToken, verifyAdminToken };