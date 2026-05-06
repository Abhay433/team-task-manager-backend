import * as authService from '../services/auth.service.js';


export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }

        const result = await authService.signup({ name, email, password, role });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const result = await authService.login(email, password);

        res.status(200).json(result);

    } catch (error) {

        res.status(401).json({ message: error.message });

    }
};

export const me = async (req, res) => {
    res.status(200).json({ user: req.user });
};
