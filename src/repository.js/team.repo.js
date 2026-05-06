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


export const addMemberRepo = async (teamId, currentUserId, newUserId) => {
    const ownerCheck = await prisma.teamMember.findFirst({
        where: { teamId: teamId, userId: currentUserId, role: 'owner' }
    });

    if (!ownerCheck) {
        throw new Error('FORBIDDEN');
    }

    return ownerCheck;
}

export const alreadyMemberRepo = async (teamId, newUserId) => {
    const alreadyMember = await prisma.teamMember.findFirst({
        where: { teamId: teamId, userId: newUserId }
    });

    return alreadyMember;
}

export const createMemberRepo = async (teamId, newUserId) => {
    // Add new member — backend always sets role to MEMBER
    const member = await prisma.teamMember.create({
        data: { team_id: teamId, user_id: newUserId, role: 'MEMBER' }
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

