import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(name, value); // No need for console.log in production
        setSignupInfo(prevSignupInfo => ({
            ...prevSignupInfo,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('Name, email, and password are required.'); // Improved message
        }
        try {
            const url = `${APIUrl}/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details || 'An error occurred during signup.'); // Fallback error message
            } else if (!success) {
                handleError(message || 'Signup failed. Please try again.'); // Fallback error message
            }
            // console.log(result); // No need for console.log in production
        } catch (err) {
            handleError(err.message || 'Network error, please try again.'); // More robust error handling
        }
    };

    return (
        <div className='auth-container'> {/* Reusing auth-container class */}
            <h1 className='auth-title'>Create Account</h1>
            <p className='auth-subtitle'>Join us to start tracking your expenses.</p>
            <form onSubmit={handleSignup} className='auth-form'> {/* Reusing auth-form class */}
                <div className='form-group'> {/* Reusing form-group class */}
                    <label htmlFor='name-signup' className='form-label'>Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='name'
                        id='name-signup' // Unique ID for accessibility
                        autoFocus
                        placeholder='Enter your name...'
                        value={signupInfo.name}
                        className='form-input' // Reusing form-input class
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='email-signup' className='form-label'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        id='email-signup' // Unique ID for accessibility
                        placeholder='Enter your email...'
                        value={signupInfo.email}
                        className='form-input'
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='password-signup' className='form-label'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        id='password-signup' // Unique ID for accessibility
                        placeholder='Create your password...'
                        value={signupInfo.password}
                        className='form-input'
                        required
                    />
                </div>
                <button type='submit' className='auth-button primary'>Sign Up</button> {/* Reusing auth-button class */}
                <div className='auth-switch-link'> {/* Reusing auth-switch-link class */}
                    <span>Already have an account? </span>
                    <Link to="/login" className='auth-link'>Login</Link> {/* Reusing auth-link class */}
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Signup;