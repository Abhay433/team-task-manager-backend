import jwt from 'jsonwebtoken';
import prisma from './config/db.js';


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

export const sanitizeUser = (user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await prisma.table_users.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Add user to request object
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authMiddleware;
