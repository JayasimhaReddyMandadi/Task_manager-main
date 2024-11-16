import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthForm() {
    const [showLogin, setShowLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCSRFToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/csrf/', {
                    withCredentials: true
                });
                axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
            } catch (error) {
                console.error('CSRF fetch error:', error);
                if (error.code === 'ERR_NETWORK') {
                    setError('Cannot connect to server. Please make sure the server is running.');
                }
            }
        };
        fetchCSRFToken();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError("Please enter both username and password");
            return;
        }
    
        try {
            const response = await axios.post('login/', {
                username,
                password
            });
            
            if (response.status === 200) {
                localStorage.setItem('username', response.data.username);
                navigate('/home');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed');
        }
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password || !confirmPassword || !firstName) {
            setError("All fields are required");
            return;
        }
        
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:8000/api/users/register/', {
                username,
                password,
                confirm_password: confirmPassword,
                first_name: firstName
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.status === 201) {
                alert('Registration successful! Please login.');
                setShowLogin(true);
                resetForm();
            }
        } catch (error) {
            console.error('Signup error:', error.response?.data);
            handleError(error);
        }
    };

    const handleError = (error) => {
        if (error.response?.data?.message) {
            setError(error.response.data.message);
        } else if (error.response?.data) {
            const errorMessage = typeof error.response.data === 'string' 
                ? error.response.data 
                : Object.values(error.response.data)[0];
            setError(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
        } else {
            setError("An error occurred. Please try again.");
        }
    };

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setError('');
    };

    const handleInputChange = (e, setter) => {
        setError('');
        setter(e.target.value);
    };

    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div>
                    {showLogin ? (
                        <div className="form-front">
                            <div className="text-2xl font-semibold mb-4">Login</div>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                placeholder="Username"
                                value={username}
                                onChange={(e) => handleInputChange(e, setUsername)}
                                required
                            />
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => handleInputChange(e, setPassword)}
                                required
                            />
                            <button 
                                type="button" 
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                            <span className="block text-center text-gray-600 mt-4">
                                Don't have an account? 
                                <button className="cursor-pointer text-blue-500" onClick={toggleForm}>
                                    Sign Up
                                </button>
                            </span>
                            {error && <div className="text-red-500 mt-4">{error}</div>}
                        </div>
                    ) : (
                        <div className="form-back">
                            <div className="text-2xl font-semibold mb-4">SignUp</div>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => handleInputChange(e, setFirstName)}
                                required
                            />
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                placeholder="Username"
                                value={username}
                                onChange={(e) => handleInputChange(e, setUsername)}
                                required
                            />
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => handleInputChange(e, setPassword)}
                                required
                            />
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => handleInputChange(e, setConfirmPassword)}
                                required
                            />
                            <button 
                                type="button" 
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
                                onClick={handleSignup}
                            >
                                Signup
                            </button>
                            <span className="block text-center text-gray-600 mt-4">
                                Already have an account? 
                                <button className="cursor-pointer text-blue-500" onClick={toggleForm}>
                                    Sign In
                                </button>
                            </span>
                            {error && <div className="text-red-500 mt-4">{error}</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuthForm;