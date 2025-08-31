require("dotenv").config();
const User = require("../models/user");
const OTP = require("../models/otp");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require('./emailService');
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            return { EC: 1, EM: "Email đã tồn tại" };
        }
        const hashPassword = await bcrypt.hash(password, saltRounds);
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "User"
        });
        
        return { EC: 0, EM: "Đăng ký thành công" };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: "Lỗi server" };
    }
};

const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return { EC: 2, EM: "Email/Password không hợp lệ" };
            } else {
                const payload = { email: user.email, name: user.name };
                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRE }
                );
                return {
                    EC: 0,
                    access_token,
                    user: { email: user.email, name: user.name }
                };
            }
        } else {
            return { EC: 1, EM: "Email/Password không hợp lệ" };
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getUserService = async () => {
    try {
        let result = await User.find({}).select("-password");
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const forgotPasswordService = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return { EC: 1, EM: "Email không tồn tại" };
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await OTP.deleteMany({ email: email });
        await OTP.create({ email, otp, expiresAt });

        const emailResult = await sendOTPEmail(email, otp);
        
        if (emailResult.success) {
            return { EC: 0, EM: "OTP đã được gửi qua email" };
        } else {
            console.log('Email failed, OTP saved to DB:', otp);
            return { EC: 1, EM: "Không thể gửi email, vui lòng thử lại" };
        }
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: "Lỗi server" };
    }
};

const resetPasswordService = async (email, otp, newPassword) => {
    try {
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return { EC: 1, EM: "OTP không hợp lệ hoặc đã hết hạn" };
        }

        const user = await User.findOne({ email });
        if (!user) {
            return { EC: 1, EM: "Email không tồn tại" };
        }

        const hashPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashPassword;
        await user.save();

        await OTP.deleteMany({ email });

        return { EC: 0, EM: "Đổi mật khẩu thành công" };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: "Lỗi server" };
    }
};

module.exports = {
    createUserService, loginService, getUserService, forgotPasswordService, resetPasswordService
};