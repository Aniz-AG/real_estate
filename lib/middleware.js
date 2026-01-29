import { verifyToken } from './helpers';
import * as cookie from 'cookie';
import { User } from '@/models/userModel';
import { connectDB } from './db';

export const isAuthenticated = async (req, res, next) => {
    await connectDB();

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Please login to access this resource',
        });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    req.user = user;
    next();
};

export const adminOnly = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Please login first',
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Only admins can access this resource',
        });
    }

    next();
};

export const withAuth = (handler, requireAdmin = false) => {
    return async (req, res) => {
        try {
            await isAuthenticated(req, res, async () => {
                if (requireAdmin) {
                    await adminOnly(req, res, async () => {
                        await handler(req, res);
                    });
                } else {
                    await handler(req, res);
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Internal Server Error',
            });
        }
    };
};
