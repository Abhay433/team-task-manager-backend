import express from 'express';
import * as projectController from '../controllers/project.controller.js';
import authMiddleware from '../AuthMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Team-scoped project routes
router.post('/teams/:teamId/projects', projectController.createProject);
router.get('/teams/:teamId/projects', projectController.getProjects);


// Individual project routes
router.get('/projects/:projectId', projectController.getProjectDetails);
router.put('/projects/:projectId', projectController.updateProject);
router.delete('/projects/:projectId', projectController.deleteProject);


export default router;
