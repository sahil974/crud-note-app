import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BASE_URL from './url';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const history = useNavigate()
    const [user, setUser] = useState({
        email: "",
        password: ""
    })

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
        try {
            await axios.post(BASE_URL + "/", user)
                .then((res) => {
                    if (res.data === "notexist") {
                        alert("Email does not exist , please signup")
                    }
                    else if (res.data === 'wrongpassword') {
                        alert("Incorrect password")
                    }
                    else {
                        const { first_name, email } = res.data
                        const passed = {
                            first_name: first_name,
                            email: email,
                        }
                        history("/note", { state: { id: passed } })
                    }

                })
                .catch((err) => {
                    alert("wrong details")
                    console.log(err)
                })
        } catch (err) {
            console.log("opps cant send data to backend " + err)
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