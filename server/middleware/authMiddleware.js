import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    // Check Authorization: Bearer <token> header first (essential for cross-origin SPA requests)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gymgenius_secret_key_123');
            req.user = await User.findById(decoded.userId).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            return next();
        } catch (error) {
            console.error('Auth verification error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no authentication token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Administrator privileges required' });
    }
};

export { protect, admin };
