import * as cookie from 'cookie';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Clear the auth cookie
    res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0),
            sameSite: 'strict',
            path: '/',
        })
    );

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
}
