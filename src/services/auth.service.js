import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken, sanitizeUser } from '../AuthMiddleware.js';
import { findByEmail, createUser, findAllUsers } from '../repository.js/auth.repo.js';

export const getAllUsers = async () => {
    return await findAllUsers();
};

export const signup = async (userData) => {
    const { name, email, password } = userData;

    const existingUser = await findByEmail(email);

    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(email, hashedPassword, name);

    return { user: sanitizeUser(user), token: generateToken(user) };
};

export const login = async (email, password) => {

    const user = await findByEmail(email);

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    return { user: sanitizeUser(user), token: generateToken(user) };
};
