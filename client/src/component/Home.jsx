import React from 'react'
import { useLocation } from 'react-router-dom'

const Home = () => {
    const location = useLocation()

    const data = location.state.id
    console.log(data)
    const { email, password, notes } = data
    console.log(email)
    console.log(password)

    return (
        <>
            <h1>Hello {email}!</h1>
            <p>Your password is: {password}</p>
            <p>Your notes are:</p>
            <ul>
                {notes.map((note, index) => (
                    <li key={index}>{note}</li>
                ))}
            </ul>
        </>
    )
}

export default Home
