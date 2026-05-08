import * as projectService from '../services/project.service.js';

export const createProject = async (req, res) => {
    try {
        const teamId = parseInt(req.params.teamId);
        const userId = req.user.id;
        const { name, description, status } = req.body;

        if (!name) return res.status(400).json({ message: 'Project name is required' });

        const project = await projectService.createProjectService(teamId, userId, { name, description, status });
        res.status(201).json(project);
    } catch (error) {
        if (error.message === 'ONLY_OWNERS_CAN_CREATE_PROJECTS') {
            return res.status(403).json({ message: 'Only team owners can create projects' });
        }
        res.status(400).json({ message: error.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const teamId = parseInt(req.params.teamId);
        const userId = req.user.id;

        const projects = await projectService.getProjectsService(teamId, userId);
        res.status(200).json(projects);
    } catch (error) {
        if (error.message === 'ACCESS_DENIED') {
            return res.status(403).json({ message: 'Access denied: You are not a member of this team' });
        }
        res.status(400).json({ message: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const userId = req.user.id;
        const updateData = req.body;

        const updatedProject = await projectService.updateProjectService(projectId, userId, updateData);
        res.status(200).json(updatedProject);
    } catch (error) {
        if (error.message === 'FORBIDDEN') {
            return res.status(403).json({ message: 'Only the project creator or team owner can update this project' });
        }
        res.status(400).json({ message: error.message });
    }
};

export const getProjectDetails = async (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const userId = req.user.id;

        const project = await projectService.getProjectDetailsService(projectId, userId);
        res.status(200).json(project);
    } catch (error) {
        if (error.message === 'NOT_FOUND') return res.status(404).json({ message: 'Project not found' });
        if (error.message === 'ACCESS_DENIED') return res.status(403).json({ message: 'Access denied' });
        res.status(400).json({ message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const userId = req.user.id;

        const project = await projectService.deleteProjectService(projectId, userId);
        res.status(200).json(project);
    } catch (error) {
        if (error.message === 'FORBIDDEN') {
            return res.status(403).json({ message: 'Only the project creator or team owner can delete this project' });
        }
        res.status(400).json({ message: error.message });
    }
};
