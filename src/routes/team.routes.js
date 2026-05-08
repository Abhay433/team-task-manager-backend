import express from 'express';
import * as teamController from '../controllers/team.controller.js';
import authMiddleware from '../AuthMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/createTeam', teamController.createTeam);
router.get('/myTeams', teamController.getMyTeams);
router.post('/:teamId/addMembers', teamController.addMember);
router.get('/:teamId/getMembers', teamController.getMembers);

export default router;