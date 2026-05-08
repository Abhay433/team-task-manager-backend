import prisma from '../config/db.js';

export const getMembershipRepo = async (teamId, userId) => {
    return await prisma.teamMember.findFirst({
        where: {
            teamId: teamId,
            userId: userId
        }
    });
};

export const createProjectRepo = async (data) => {
    return await prisma.project.create({
        data: {
            name: data.name,
            description: data.description,
            teamId: data.teamId,
            createdById: data.userId
        }
    });
};

export const getProjectsByTeamRepo = async (teamId) => {
    return await prisma.project.findMany({
        where: { teamId: teamId },
        orderBy: { createdAt: 'desc' }
    });
};

export const getProjectByIdRepo = async (projectId) => {
    return await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            team: {
                include: {
                    members: {
                        include: {
                            user: {
                                select: { id: true, name: true, email: true }
                            }
                        }
                    }
                }
            },
            createdBy: {
                select: { id: true, name: true, email: true }
            }
        }
    });
};

export const updateProjectRepo = async (projectId, data) => {
    return await prisma.project.update({
        where: { id: projectId },
        data: data
    });
};

export const deleteProjectRepo = async (projectId) => {
    return await prisma.project.delete({
        where: { id: projectId }
    });
};


