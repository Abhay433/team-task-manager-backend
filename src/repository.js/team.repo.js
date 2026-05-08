import prisma from '../config/db.js';

export const createTeamRepo = async (name, userId) => {

    const team = await prisma.$transaction(async (tx) => {
        const newTeam = await tx.team.create({         // ✅ prisma.team not prisma.teams
            data: {
                name,
                createdById: userId                    // ✅ scalar field, not relation name
            }
        });

        await tx.teamMember.create({                   // ✅ prisma.teamMember not prisma.team_members
            data: {
                teamId: newTeam.id,                    // ✅ camelCase as per schema
                userId: userId,                        // ✅ camelCase as per schema
                role: 'owner'                          // ✅ lowercase to match enum
            }
        });

        return newTeam;
    });

    return team;
}


export const addMemberRepo = async (teamId, currentUserId) => {
    const ownerCheck = await prisma.teamMember.findFirst({
        where: {
            teamId: teamId,
            userId: currentUserId,
            role: 'owner'
        }
    });

    return ownerCheck;
}

export const alreadyMemberRepo = async (teamId, newUserId) => {
    const alreadyMember = await prisma.teamMember.findFirst({
        where: {
            teamId: teamId,
            userId: newUserId
        }
    });

    return alreadyMember;
}

export const createMemberRepo = async (teamId, newUserId, addedBy) => {
    // Add new member — backend always sets role to member
    const member = await prisma.teamMember.create({
        data: {
            teamId: teamId,
            userId: newUserId,
            role: 'member',
            addedBy: addedBy
        }
    });

    return member;
}



export const getMembersRepo = async (teamId) => {
    const members = await prisma.teamMember.findMany({
        where: { teamId: teamId },
        include: {
            user: {
                select: { id: true, name: true, email: true }
            }
        }
    });

    return members;
};
export const findUserTeams = async (userId) => {
    return await prisma.team.findMany({
        where: {
            members: {
                some: {
                    userId: userId
                }
            }
        },
        include: {
            _count: {
                select: { members: true, projects: true }
            }
        }
    });
};
