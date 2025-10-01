import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RefrshHandler({ setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if a token exists in localStorage
        if (localStorage.getItem('token')) {
            // If token exists, the user is considered authenticated
            setIsAuthenticated(true);

            // If the user is on the root, login, or signup page,
            // and they are authenticated, redirect them to the home page.
            if (
                location.pathname === '/' ||
                location.pathname === '/login' ||
                location.pathname === '/signup'
            ) {
                // Use navigate with { replace: true } to prevent going back to login/signup
                // after being redirected to home. This cleans up the history stack.
                navigate('/home', { replace: true });
            }
        } else {
            // If no token, ensure isAuthenticated state is false
            setIsAuthenticated(false);
            // Optionally, if they are trying to access a protected route
            // without a token, you might want to redirect them to login.
            // However, PrivateRoute in App.js already handles this.
        }
    }, [location.pathname, navigate, setIsAuthenticated]); // Added location.pathname to dependencies for precision

    // This component renders nothing, it's purely for side effects (authentication handling)
    return null;
}

export default RefrshHandler;