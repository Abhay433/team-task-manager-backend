import prisma from '../config/db.js';

export const createTaskRepo = async (data) => {
    return await prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            projectId: data.projectId,
            assignedToId: data.assignedToId,
            createdById: data.createdById,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            priority: data.priority || 'medium'
        }
    });
};

export const findTaskByIdRepo = async (taskId) => {
    return await prisma.task.findUnique({
        where: { id: taskId },
        include: {
            project: {
                select: { teamId: true }
            }
        }
    });
};

export const updateTaskRepo = async (taskId, data) => {
    return await prisma.task.update({
        where: { id: taskId },
        data: data
    });
};

export const getTasksRepo = async (filters) => {
    const where = {};
    if (filters.projectId) where.projectId = filters.projectId;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;
    if (filters.status) where.status = filters.status;

    return await prisma.task.findMany({
        where,
        include: {
            assignedTo: {
                select: { id: true, name: true, email: true }
            },
            createdBy: {
                select: { id: true, name: true, email: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};
