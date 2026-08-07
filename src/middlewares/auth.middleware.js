const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/jwt");

const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                mensaje: "Debe iniciar sesión para continuar."
            });
        }

        const [tipo, token] = authHeader.trim().split(/\s+/);

        if (tipo !== "Bearer" || !token) {
            return res.status(401).json({
                mensaje: "La sesión proporcionada no es válida."
            });
        }

        req.usuario = jwt.verify(token, SECRET_KEY, {
            algorithms: ["HS256"],
            issuer: "sistema-incidentes",
            audience: "sistema-incidentes-web"
        });

        next();
    } catch (error) {
        return res.status(401).json({
            mensaje: "Su sesión no es válida o ha expirado. Inicie sesión nuevamente."
        });
    }
};

module.exports = { verificarToken };
