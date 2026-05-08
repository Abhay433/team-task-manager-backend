import * as taskService from '../services/task.service.js';

export const createTask = async (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const userId = req.user.id;
        const { title, description, assignedToId, dueDate, priority } = req.body;

        if (!title) return res.status(400).json({ message: 'Task title is required' });

        const task = await taskService.createTaskService(projectId, userId, { 
            title, 
            description, 
            assignedToId, 
            dueDate, 
            priority 
        });
        res.status(201).json(task);
    } catch (error) {
        if (error.message === 'ONLY_OWNERS_CAN_CREATE_TASKS') {
            return res.status(403).json({ message: 'Only team owners can create and assign tasks' });
        }
        if (error.message === 'ASSIGNEE_MUST_BE_TEAM_MEMBER') {
            return res.status(400).json({ message: 'Assigned user must be a member of this team' });
        }
        res.status(400).json({ message: error.message });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const taskId = parseInt(req.params.taskId);
        const userId = req.user.id;
        const { status } = req.body;

        if (!status) return res.status(400).json({ message: 'Status is required' });

        const updatedTask = await taskService.updateTaskStatusService(taskId, userId, status);
        res.status(200).json(updatedTask);
    } catch (error) {
        if (error.message === 'FORBIDDEN_TASK_UPDATE') {
            return res.status(403).json({ message: 'You can only update status for tasks assigned to you or if you are the team owner' });
        }
        res.status(400).json({ message: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const userId = req.user.id;
        const { assignedToId, status } = req.query;

        const tasks = await taskService.getTasksService(projectId, userId, { 
            assignedToId: assignedToId ? parseInt(assignedToId) : undefined, 
            status 
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
