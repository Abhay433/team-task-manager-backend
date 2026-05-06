import * as teamRepo from '../repository.js/team.repo.js';

export const createTeamService = async (name, userId) => {
    const team = await teamRepo.createTeamRepo(name, userId);
    return team;
}




export const addMemberService = async (teamId, currentUserId, newUserId) => {

    const ownerCheck = await teamRepo.addMemberRepo(teamId, currentUserId, newUserId);


    if (!ownerCheck) {
        throw new Error('FORBIDDEN');
    }

    const alreadyMember = await teamRepo.addMemberRepo(teamId, currentUserId, newUserId);


    if (alreadyMember) {
        throw new Error('User is already a member of this team');
    }

    const member = await teamRepo.createMemberRepo(teamId, currentUserId, newUserId);
    return member;
};

export const getMembersService = async (teamId) => {
    const members = await teamRepo.getMembersRepo(teamId);

    return members.map(m => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        role: m.role
    }));
};
