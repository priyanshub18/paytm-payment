const {JWT_SECRET} = "your-jwt-secret"
const {jwt} = require('jsonwebtoken')
const UserMiddleWare = (req , res , next) => {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer")) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    try {
        const decoded = jwt.verify(token , JWT_SECRET);
        req.username = decoded.username;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized",
        });
    }

}

module.exports = {
    UserMiddleWare
}