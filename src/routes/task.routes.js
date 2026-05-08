import express from 'express';
import * as taskController from '../controllers/task.controller.js';
import authMiddleware from '../AuthMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Project-scoped task routes
router.post('/projects/:projectId/tasks', taskController.createTask);
router.get('/projects/:projectId/tasks', taskController.getTasks);

// Individual task routes
router.patch('/tasks/:taskId/status', taskController.updateTaskStatus);

export default router;
