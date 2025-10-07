const router = require("express").Router();
const AuthService = require("../services/authService");
const HttpStatus = require("../constants/httpStatusCodes");
const MESSAGES = require("../constants/messages");

/**
 * @route POST /auth/register
 * @desc Register a new user
 */
router.post("/register", async (req, res) => {
    try {
        const user = await AuthService.register(req.body);
        res.status(HttpStatus.CREATED).json({
            msg: MESSAGES.USER.CREATED,
            data: {
                id: user.userId,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.log("error in register", err)
        res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message,
        });
    }
});

/**
 * @route POST /auth/login
 * @desc Login user
 */
router.post("/login", async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await AuthService.login(req.body);
        res.status(HttpStatus.OK).json({
            msg: MESSAGES.AUTH.LOGIN_SUCCESS,
            data: {
                user: {
                    id: user.userId,
                    name: user.name,
                    role: user.role?.name,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (err) {
        res.status(err.statusCode || HttpStatus.UNAUTHORIZED).json({
            error: err.message,
        });
    }
});

/**
 * @route POST /auth/refresh
 * @desc Refresh access token
 */
router.post("/refresh", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: "Refresh token missing" });
        }

        const result = await AuthService.refresh(refreshToken);
        res.status(HttpStatus.OK).json(result);
    } catch (err) {
        res.status(err.statusCode || HttpStatus.UNAUTHORIZED).json({ error: err.message });
    }
});

/**
 * @route POST /auth/logout
 * @desc Logout user
 */
router.post("/logout", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: "Refresh token missing" });
        }

        const result = await AuthService.logout(refreshToken);
        res.status(HttpStatus.OK).json(result);
    } catch (err) {
        res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
});

module.exports = router;
