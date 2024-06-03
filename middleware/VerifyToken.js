import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Users from '../models/UserModel.js';

dotenv.config();

export const verifyToken = async(req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ status: 'error', msg: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Users.findOne({ where: { id: decoded.id, activeSession: token } });
        if (!user) {
            return res.status(401).json({ status: 'error', msg: 'Invalid token or session has expired.' });
        }
        req.user = user;
        next();
    } catch (ex) {
        res.status(400).json({ status: 'error', msg: 'Invalid token.' });
    }
};

export const generateToken = (user, keepLogin) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const options = {
        expiresIn: keepLogin ? '7d' : '1d' // Change expiration time based on 'keepLogin'
    };

    return jwt.sign(payload, process.env.JWT_SECRET, options);
};

export const generateApiKey = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let apiKey = "AP";
    for (let i = 0; i < length - 2; i++) {
        apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return apiKey;
};