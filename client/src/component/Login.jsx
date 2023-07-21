import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BASE_URL from './url';
import jwt_decode from 'jwt-decode';


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const [user, setUser] = useState({
        email: "",
        password: ""
    })




    useEffect(() => {

        // Function to check if the token has expired
        function isTokenExpired(token) {
            try {
                const decodedToken = jwt_decode(token);

                // Check if the token is expired by comparing the current time with the expiration time
                if (decodedToken && decodedToken.exp) {
                    const currentTime = Date.now() / 1000; // Convert to seconds (Unix timestamp)
                    return currentTime > decodedToken.exp;
                }
            } catch (error) {
                // If decoding fails, consider the token as expired
                console.error('Error decoding token:', error);
            }

            // If the token does not have an expiration time or decoding failed, consider it as expired
            return true;
        }

        const ifToken = () => {
            const token = localStorage.getItem("token")
            // console.log(token)
            if (token && !isTokenExpired(token)) {
                navigate("/note")
            }

        }
        ifToken()
    }, [navigate])

    const toggleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    function changehandler(event) {
        const { name, value } = event.target

        setUser({
            ...user,
            [name]: value
        })
    }

    async function submit(event) {
        event.preventDefault();
        if (user.email.trim() === "" || user.password.trim() === "") {
            alert("Enter the details");
        } else {
            try {
                const res = await axios.post(BASE_URL + "/", user);
                if (res.data === "notexist") {
                    alert("Email does not exist, please signup");
                } else if (res.data === 'wrongpassword') {
                    alert("Invalid Credentials");
                } else {
                    localStorage.setItem("token", res.data);
                    // window.location = "/note";
                    navigate("/note");
                }
            } catch (err) {
                console.log("oops can't send data to the backend " + err);
            }
        }
    }
    return (
        <>
            <div className="login-page">
                <div className="login-container">
                    <h1 className='signup-heading'>Login</h1>
                    <form className="signup-form">
                        <input
                            type="text"
                            name="email"
                            className="signup-input-field"
                            placeholder="Enter your email"
                            onChange={changehandler}
                        />
                        <div className="password-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className="signup-input-field password"
                                placeholder="Enter your password"
                                onChange={changehandler}
                            />
                            <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'} eye-icon`} id='show-password'
                                onClick={toggleShowPassword}></i>
                        </div>
                        <button type="submit" className="signup-button" onClick={submit}>
                            Login
                        </button>
                    </form>
                    <div className="or-divider">or</div>
                    <div className="link">
                        <Link to="/signup">Sign Up Page</Link>
                    </div>
                </div>
            </div>
            {/* <div className="container">
                <h1>Login</h1>
                <form method='post'>
                    <input type="text" name="email" value={user.email} placeholder='Enter your email' onChange={changehandler} />
                    <input type="text" name='password' value={user.password} placeholder='Enter your password' onChange={changehandler} />
                    <button type='submit' onClick={submit}>Login</button>
                </form>

                <div className="or-divider">or</div>

                <div className="link">
                    <Link to="/signup">SignUp Page</Link>
                </div>

            </div> */}
        </>
    )
}

export default Login