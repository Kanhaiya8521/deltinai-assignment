
import { verifyToken, prisma, sendUnAuthorizedError } from "./../utility/index.js";

const { user: Users } = prisma;

export const isLoggedIn = async (req, res, next) => {
  try {
    let token;
    token = req.headers["Authorization"] || req.headers["authorization"];

    if (!token) return sendUnAuthorizedError(res);
    token = token.replace("Bearer ", "");

    const decoded_user = verifyToken(token);
    if (!decoded_user) return sendUnAuthorizedError(res);

    const user_data = await Users.findUnique({
      where: { id: decoded_user.user },
      select: { id: true, username: true, email: true, first_name: true, last_name: true, is_deleted: true, store_disable: true }
    });

    const user = user_data;

    if (!user || user.is_deleted) return sendUnAuthorizedError(res);

    req["user"] = user;

    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendUnAuthorizedError(res);
    } else {
      return next(err);
    }
  }
};
