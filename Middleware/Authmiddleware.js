import jwt from 'jsonwebtoken';
import Admin from '../Models/Admin.js';

export const protect = async (req, res, next) => {
    let token;

    // 1. Get token and check if it's there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
    }

    try {
        // 2. Verification of token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check if admin still exists
        const currentAdmin = await Admin.findById(decoded.id);
        if (!currentAdmin) {
            return res.status(401).json({ message: 'The admin belonging to this token no longer exists.' });
        }

        // 4. Grant access to protected route
        req.admin = currentAdmin;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
};
