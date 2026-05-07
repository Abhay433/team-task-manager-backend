import prisma from "../config/db.js"

export const findByEmail = (email) => {
    return prisma.table_users.findUnique({ where: { email } })
}

export const createUser = async (email, hashedPassword, name) => {
    const user = await prisma.table_users.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: "member",
        }
    });
    return user;
}