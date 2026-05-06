import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken, sanitizeUser } from '../AuthMiddleware.js';

export const signup = async (userData) => {
    const { name, email, password, role } = userData;

    const existingUser = await prisma.table_users.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.table_users.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: "member",
        }
    });

    return { user: sanitizeUser(user), token: generateToken(user) };
};

export const login = async (email, password) => {

    const user = await prisma.table_users.findUnique({

        where: { email }
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    return { user: sanitizeUser(user), token: generateToken(user) };
};
