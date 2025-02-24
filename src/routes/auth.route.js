import { auth_controller } from '../controllers/auth.controller.js';
import { isLoggedIn } from '../middleware/is_logged_in.middleware.js';


export default (router) => {
    router.route("/auth/signup").post(auth_controller.signup);
    router.route("/auth/login-session").post(auth_controller.userLoginSession);
    router.route("/auth/login").post(auth_controller.login);
    router.route("/auth/logout").post(isLoggedIn, auth_controller.logout);
    router.route("/auth/refresh-token").post(auth_controller.newRefreshToken);
  
  };