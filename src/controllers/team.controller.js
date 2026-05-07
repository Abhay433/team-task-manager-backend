import * as teamService from '../services/team.service.js';

export const createTeam = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;




        if (!name) return res.status(400).json({ message: 'Team name is required' });

        const team = await teamService.createTeamService(name, userId);

        res.status(201).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const addMember = async (req, res) => {
    try {
        const teamId = parseInt(req.params.teamId);
        const { userId } = req.body;
        const currentUserId = req.user.id;

        if (!userId) return res.status(400).json({ message: 'userId is required' });

        const member = await teamService.addMemberService(teamId, currentUserId, userId);
        res.status(201).json(member);
    } catch (error) {
        if (error.message === 'FORBIDDEN') {
            return res.status(403).json({ message: 'Only team owners can add members' });
        }
        res.status(400).json({ message: error.message });
    }
};

export const getMembers = async (req, res) => {
    try {
        const teamId = parseInt(req.params.teamId);
        const members = await teamService.getMembersService(teamId);

        res.status(200).json(members);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};