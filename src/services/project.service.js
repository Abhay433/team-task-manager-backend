import * as projectRepo from '../repository.js/project.repo.js';

export const createProjectService = async (teamId, userId, projectData) => {
    // 1. Check if user is the team owner
    const membership = await projectRepo.getMembershipRepo(teamId, userId);

    if (!membership || membership.role !== 'owner') {
        throw new Error('ONLY_OWNERS_CAN_CREATE_PROJECTS');
    }

    // 2. Create project
    return await projectRepo.createProjectRepo({
        ...projectData,
        teamId,
        userId
    });
};

export const getProjectsService = async (teamId, userId) => {
    // 1. Check membership
    const membership = await projectRepo.getMembershipRepo(teamId, userId);
    if (!membership) {
        throw new Error('ACCESS_DENIED');
    }

    // 2. Fetch projects
    return await projectRepo.getProjectsByTeamRepo(teamId);
};

export const updateProjectService = async (projectId, userId, updateData) => {
    // 1. Get project to check ownership and team
    const project = await projectRepo.getProjectByIdRepo(projectId);
    if (!project) {
        throw new Error('Project not found');
    }

    // 2. Get user's role in that team
    const membership = await projectRepo.getMembershipRepo(project.teamId, userId);

    // 3. Authorization Logic (Option B)
    // Allowed if: User is project creator OR User is team owner
    const isCreator = project.createdById === userId;
    const isTeamOwner = membership?.role === 'owner';

    if (!isCreator && !isTeamOwner) {
        throw new Error('FORBIDDEN');
    }

    // 4. Update project
    return await projectRepo.updateProjectRepo(projectId, updateData);
};

export const getProjectDetailsService = async (projectId, userId) => {
    const project = await projectRepo.getProjectByIdRepo(projectId);
    if (!project) throw new Error('NOT_FOUND');

    // Check if user is a member of the team
    const membership = await projectRepo.getMembershipRepo(project.teamId, userId);
    if (!membership) throw new Error('ACCESS_DENIED');

    return {
        ...project,
        teamMembers: project.team.members.map(m => ({
            id: m.user.id,
            name: m.user.name,
            email: m.user.email,
            role: m.role
        }))
    };
};

export const deleteProjectService = async (projectId, userId) => {
    // 1. Get project to check ownership and team
    const project = await projectRepo.getProjectByIdRepo(projectId);
    if (!project) throw new Error('Project not found');

    // 2. Get user's role in that team
    const membership = await projectRepo.getMembershipRepo(project.teamId, userId);

    // 3. Authorization: Only Project Creator OR Team Owner can delete
    const isCreator = project.createdById === userId;
    const isTeamOwner = membership?.role === 'owner';

    if (!isCreator && !isTeamOwner) {
        throw new Error('FORBIDDEN');
    }

    // 4. Delete project
    return await projectRepo.deleteProjectRepo(projectId);
};

