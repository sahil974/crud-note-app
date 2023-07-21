import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from './url';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showCpassword, setShowCpassword] = useState(false);

    const navigate = useNavigate()
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        cpassword: "",
        notes: []
    })

    const toggleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    const toggleShowCpassword = () => {
        setShowCpassword((prevState) => !prevState);
    };

    function changehandler(event) {
        const { name, value } = event.target

        setUser({
            ...user,
            [name]: value
        })
    }

    async function submit(event) {
        event.preventDefault()
        if (!user.first_name || !user.last_name || !user.email || !user.password || !user.cpassword) {
            alert("Enter the deatils Properly")
        }

        else if (user.password !== user.cpassword)
            alert("Password does not match !!")
        else {

            try {
                // console.log(user)
                await axios.post(BASE_URL + "/signup", user)
                    .then((res) => {
                        if (res.data === "alreadyexist") {
                            alert("User already exists, Please Login")
                        }
                        else if (res.data === "Invalid email address")
                            alert("Invalid Email Address")
                        else {
                            localStorage.setItem("token", res.data);
                            navigate("/note")
                        }
                    })
            } catch (err) {
                // console.log("error while sighup " + err)
                alert("Can't Signup")
                console.log(err)
            }
        }
    }
    return (
        <>
            <div className="login-page">
                <div className="login-container">
                    <h1 className="signup-heading">Sign Up</h1>
                    <form className="signup-form">
                        <input
                            type="text"
                            name="first_name"
                            className="signup-input-field"
                            placeholder="Enter your first name"
                            onChange={changehandler}
                        />
                        <input
                            type="text"
                            name="last_name"
                            className="signup-input-field"
                            placeholder="Enter your last name"
                            onChange={changehandler}
                        />
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
                        <div className="password-container">
                            <input
                                type={showCpassword ? 'text' : 'password'}
                                name="cpassword"
                                className="signup-input-field password"
                                placeholder="Re-Enter your password"
                                onChange={changehandler}
                            />
                            <i className={`fa-regular ${showCpassword ? 'fa-eye' : 'fa-eye-slash'} eye-icon`} id='show-password'
                                onClick={toggleShowCpassword}></i>
                        </div>
                        <button type="submit" className="signup-button" onClick={submit}>
                            Sign Up
                        </button>
                    </form>
                    <div className="or-divider">or</div>
                    <div className="link">
                        <Link to="/">Login Page</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup