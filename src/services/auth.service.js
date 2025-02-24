// import { Prisma } from "@prisma/client";
import { prisma, generateSalt, generateHashPassword, verifyPassword, sanitizeUsers, AppError, verifyToken, generateJWTToken } from "./../utility/index.js"
const { user: User, userLoginSession: UserLoginSession, refreshToken: RefreshToken } = prisma;

const signup = async (value) => {


    if (value.password !== value.confirm_password) throw new AppError(`Password and Confirm Password are not matched !!`, 400);


    let query = { email: value.email };
    const already_email_taken = await User.findFirst({ where: query });
    if (already_email_taken) throw new AppError(`This email is already taken !!`, 409);

    // query = { phone: value.phone };
    // const already_phone_taken = await User.findFirst({where: query});
    // console.log(already_phone_taken, query)
    // if (already_phone_taken) throw new AppError("This phone number is already taken !!", 409);

    // query = { username: value.username , mode: "insensitive"};
    // const is_username_exits = await User.findFirst({where: query});
    // if (is_username_exits) throw new AppError("This username is already taken !!", 409);

    const salt = await generateSalt();
    value.password = await generateHashPassword(value.password, salt);
    value = sanitizeUsers(value, ["confirm_password"]);

    let user = await User.create({
        data: {
            ...value,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            username: true,
            phone: true,
            status: true
        }
    });

    if (!user) {
        throw new AppError("Unable to register new user !!", 400);
    }


    return user

    // const user = await User.create({
    //     data: {
    //         email: value.email,
    //         password: value.password
    //     },
    //     select: {
    //         id: true,
    //         email: true
    //     }
    // })

    // return user;
}


const login = async (value) => {
    let user_login_session = await UserLoginSession.findFirst({ where: { login_session: value.login_session } });
    if (!user_login_session) throw new AppError("Invalid login session !!", 400);

    const user = await User.findFirst({ where: { email: value.email } });
    if (!user) throw new AppError("Invalid email and/or password !!", 400);

    if (user.is_deleted) throw new AppError("Your user account has been disabled. For additional details, kindly get in touch with us !!", 400);

    /* Access token and refresh token */
    const access_token = generateJWTToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRES);
    const refresh_token = generateJWTToken(user, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRES);

    const user_refresh_token = await RefreshToken.create({ data: { token: refresh_token } });
    if (!user_refresh_token) {
        throw new AppError("Unable to save refresh token !!", 400);
    }


    user_login_session = await UserLoginSession.delete({ where: { id: user_login_session.id } });
    if (!user_login_session) {
        throw new AppError("Unable to remove used user login session !!", 400);
    }


    // Change active status as online
    const user_active_status = await User.update({ where: { id: user.id }, data: { status: true } });
    if (!user_active_status) throw new AppError("Unable to change user active session", 400);

    return {
        refresh_token,
        access_token,
        access_token_expires: process.env.ACCESS_TOKEN_EXPIRES
    };
}


const userLoginSession = async (value) => {
    const user = await User.findFirst({
        where: {
            OR: [
                { email: value.email.toLowerCase() },
                {
                    username: {
                        equals: value.email,
                        mode: "insensitive"
                    }
                }
            ]
        }
    });
    if (!user) throw new AppError("Invalid email and/or password !!", 400);

    const password_matched = await verifyPassword(value.password, user.password);
    if (!password_matched) throw new AppError("Invalid email and/or password !!", 400);

    if (user.is_deleted) throw new AppError("Your user account has been disabled. For additional details, kindly get in touch with us !!", 400);

    const session_token = randomToken(42);
    const user_login_session = await UserLoginSession.create({ data: { login_session: session_token }, select: { login_session: true } });
    if (!user_login_session) throw new AppError("Unable to create user login session !!", 400);

    return { email: user.email || null, username: user.username, login_session: user_login_session.login_session, is_email_verified: user_otp_details?.is_email_verified || false, two_fa_status: user_two_fa, profile_updated: user.profile_updated };
}


const logout = async (value, user_info) => {
    let refresh_token = await RefreshToken.findUnique({ where: { token: value.refresh_token } });
    if (!refresh_token) {
        throw new AppError("Refresh token record not found !!", 401);
    }

    const decoded_user = verifyToken(refresh_token.token, process.env.REFRESH_TOKEN_SECRET);

    // Change active status as offline
    const user = await User.findUnique({ where: { id: decoded_user.user } });
    if (!user) throw new AppError("User record not found !! ", 401);

    const user_active_status = await User.update({ where: { id: user.id }, data: { status: false } });
    if (!user_active_status) throw new AppError("Unable to change user active session", 400);

    const logout = await RefreshToken.delete({ where: { id: refresh_token.id } });
    if (!logout) {
        throw new AppError("Unable to remove refresh token !!", 400);
    }

    return !!refresh_token;
};

const newRefreshToken = async (value) => {
    let refresh_token = await RefreshToken.findUnique({ where: { token: value.refresh_token } });
    if (!refresh_token) throw new AppError("Refresh token record not found !!", 401);

    const decoded_user = verifyToken(refresh_token.token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findFirst({ where: { id: decoded_user.user, is_deleted: false } });
    if (!user) {
        await RefreshToken.delete({ where: { id: refresh_token.id } });
        throw new AppError("Invalid user !!", 401);
    }

    const access_token = generateJWTToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRES);
    const new_refresh_token = generateJWTToken(refresh_token, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRES);

    refresh_token = await RefreshToken.update({
        where: { id: refresh_token.id },
        data: {
            token: new_refresh_token
        }
    });

    return { access_token, refresh_token: refresh_token.token };
};


export const auth_service = {
    signup,
    userLoginSession,
    logout,
    newRefreshToken
};
