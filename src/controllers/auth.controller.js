import { auth_service } from "../services/auth.service.js";
import { AppError, catchAsync } from "../utility/index.js";
import { loginValidation, refreshTokenValidation, signupValidation } from "../validations/auth.validation.js"


const signup = async (req, res) => {
    const { error, value } = signupValidation(req.body);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }

    const user = await auth_service.signup(value);

    return res.status(201).json({
        status: true,
        ...user
    })
}

const userLoginSession = async (req, res, next) => {
    const { error, value } = loginValidation(req.body);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }

    const user_login_session = await auth_service.userLoginSession(value);
    return res.json({
        success: true,
        data: user_login_session
    });
};

const login = async (req, res, next) => {
    const { error, value } = userLoginSessionValidation(req.body);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }

    const data = await auth_service.login(value);
    return res.json({
        success: true,
        data
    });
}

const newRefreshToken = async (req, res, next) => {
    const { error, value } = refreshTokenValidation(req.body);
    if (error) {
        if (error) {
            throw new AppError(error.details[0].message, 400);
        }
    }

    const refresh_token = await auth_service.newRefreshToken(value);
    return res.json({
        success: true,
        data: refresh_token
    });
};

const logout = async (req, res, next) => {
    const { error, value } = refreshTokenValidation(req.body);
    if (error) {
      if (error) {
        throw new AppError(error.details[0].message, 400);
      }
    }
  
    const logout = await auth_service.logout(value, req.user);
    return res.json({
      success: logout,
      message: "Logout successfully !!"
    });
  };


export const auth_controller = {
    signup: catchAsync(signup),
    userLoginSession: catchAsync(userLoginSession),
    login: catchAsync(login),
    newRefreshToken: catchAsync(newRefreshToken),
    logout: catchAsync(logout),
}