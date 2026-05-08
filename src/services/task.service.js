import * as taskRepo from '../repository.js/task.repo.js';
import * as projectRepo from '../repository.js/project.repo.js';

export const createTaskService = async (projectId, currentUserId, taskData) => {
    // 1. Find project to get teamId
    const project = await projectRepo.getProjectByIdRepo(projectId);
    if (!project) throw new Error('PROJECT_NOT_FOUND');

    const teamId = project.teamId;

    // 2. Check if current user is the team owner
    const creatorMembership = await projectRepo.getMembershipRepo(teamId, currentUserId);
    if (!creatorMembership || creatorMembership.role !== 'owner') {
        throw new Error('ONLY_OWNERS_CAN_CREATE_TASKS');
    }

    // 3. Check if assigned user is a member of this team
    if (taskData.assignedToId) {
        const assigneeMembership = await projectRepo.getMembershipRepo(teamId, taskData.assignedToId);
        if (!assigneeMembership) {
            throw new Error('ASSIGNEE_MUST_BE_TEAM_MEMBER');
        }
    }

    // 4. Create task
    return await taskRepo.createTaskRepo({
        ...taskData,
        projectId,
        createdById: currentUserId
    });
};

export const updateTaskStatusService = async (taskId, userId, status) => {
    const task = await taskRepo.findTaskByIdRepo(taskId);
    if (!task) throw new Error('TASK_NOT_FOUND');

    const teamId = task.project.teamId;

    // Check permissions
    const membership = await projectRepo.getMembershipRepo(teamId, userId);

    const isOwner = membership?.role === 'owner';
    const isAssignee = task.assignedToId === userId;

    if (!isOwner && !isAssignee) {
        throw new Error('FORBIDDEN_TASK_UPDATE');
    }

    return await taskRepo.updateTaskRepo(taskId, { status });
};

export const getTasksService = async (projectId, userId, filters) => {
    // Basic membership check for the project's team
    const project = await projectRepo.getProjectByIdRepo(projectId);
    if (!project) throw new Error('PROJECT_NOT_FOUND');

    const membership = await projectRepo.getMembershipRepo(project.teamId, userId);
    if (!membership) throw new Error('ACCESS_DENIED');

    return await taskRepo.getTasksRepo({ ...filters, projectId });
};
