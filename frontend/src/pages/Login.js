import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(name, value); // No need for console.log in production code
        setLoginInfo(prevLoginInfo => ({
            ...prevLoginInfo,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required'); // Improved message
        }
        try {
            const url = `${APIUrl}/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details || 'An error occurred during login.'); // Fallback error message
            } else if (!success) {
                handleError(message || 'Login failed. Please check your credentials.'); // Fallback error message
            }
            // console.log(result); // No need for console.log in production code
        } catch (err) {
            handleError(err.message || 'Network error, please try again.'); // More robust error handling
        }
    };

    return (
        <div className='auth-container'> {/* New class for the main container */}
            <h1 className='auth-title'>Welcome Back!</h1>
            <p className='auth-subtitle'>Log in to manage your expenses.</p>
            <form onSubmit={handleLogin} className='auth-form'>
                <div className='form-group'>
                    <label htmlFor='email-login' className='form-label'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        id='email-login' // Unique ID for accessibility
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                        className='form-input'
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='password-login' className='form-label'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        id='password-login' // Unique ID for accessibility
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                        className='form-input'
                        required
                    />
                </div>
                <button type='submit' className='auth-button primary'>Login</button>
                <div className='auth-switch-link'> {/* Wrapper for the link */}
                    <span>Don't have an account? </span>
                    <Link to="/signup" className='auth-link'>Sign up</Link>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;