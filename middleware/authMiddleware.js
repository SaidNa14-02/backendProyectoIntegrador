import jwt from "jsonwebtoken";

export const isauthenticated = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token no autorizado o no proporcionado" });
  }
  const token = authorization.split('Bearer ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    //Se inyecta el token en la request para que esté disponible para los controllers
    req.user = payload;
    next();
  }
    catch (error) {
        return res.status(401).json({ message: "Token inválido"})
    }
};
