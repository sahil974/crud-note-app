import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { LuEdit } from 'react-icons/lu';

import BASE_URL from './url';

const Notes = () => {
    const [updatedText, setUpdatedText] = useState('')


    // const location = useLocation()
    const navigate = useNavigate()

    // const { first_name, email } = location.state.id
    const [email, setEmail] = useState(null)
    const [name, setName] = useState(null)
    const [nota, setNota] = useState([])

    // console.log(nota)

    const updateData = async (id) => {
        if (updatedText.trim() === "") {
            alert("Enter the task")
            return;
        }
        await axios.patch(BASE_URL + "/note/" + email, { id, updatedText })
            .then((res) => {
                setNota(res.data)
            })
            .catch((err) => {
                // console.log(err)
            })
        setDisplay(-1)

    }



    const [display, setDisplay] = useState(-1)

    const handleEdit = (id) => {

        setDisplay(id)

    }

    // const fetchNotes = async () => {
    //     try {
    //         // console.log(email)
    //         await axios.get(BASE_URL + "/note/" + email)
    //             .then((res) => {
    //                 // console.log(res.data)
    //                 setNota(res.data)
    //             })

    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    useEffect(() => {

        const auth = async () => {
            // console.log("auth checked")
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token')

            if (token) {
                // Include the token in the request headers
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                // Make a request to get user information using the token
                axios.get(BASE_URL + '/note', config)
                    .then((res) => {
                        const received = res.data
                        // console.log(received)
                        setNota(received.notes)
                        setName(received.first_name)
                        setEmail(received.email)
                    })
                    .catch((err) => {
                        console.log('Error getting user information:', err);
                    })
            } else {
                navigate("/")
            }
        }

        // fetchNotes()
        auth()
    }, [navigate])

    const [newItem, setNewItem] = useState('');



    function changeHandler(event) {
        const value = event.target.value;
        setNewItem(value);
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/")
    };


    function addItems() {
        if (newItem.trim() === "")
            alert("Enter the task")
        else {

            axios.post(BASE_URL + "/note/" + email, { newItem })
                .then((res) => {
                    if (res.data === 'added') {

                    }
                    else {
                        alert("Not Added");
                    }
                })
            // setItems([...items, newItem]);
            // nota.push(newItem)
            setNota([...nota, newItem])
            setNewItem('');
        }
    }


    const deleteItem = async (id) => {

        await axios.delete(BASE_URL + "/note/" + email + "/" + id)
            .then((res) => {
                if (res.data === "deleted") {

                }
            })
            .catch((err) => {
                // console.log(err)
            })

        // console.log(id + " temp before del " + temp)

        const temp = nota.filter((ele, ind) => {
            return ind !== id
        })

        // console.log("temp after del " + temp)
        setNota(temp)

        // console.log("Nota after del " + nota)
    }

    return (
        <>
            <div className="header">
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <div className="main_div">
                <h1 className='heading'>Hello {name}</h1>
                <div className="center_div">
                    <br />
                    <h1 className="todo-heading">ToDo List</h1>
                    <input
                        type="text"
                        name="newItem"
                        value={newItem}
                        onChange={changeHandler}
                        placeholder="✍️Add an item"
                        className="todo-input"
                    />
                    <button onClick={addItems} className="todo-button">+</button>
                    <ol className="todo-list">
                        {nota.map(function (ele, index) {
                            return (
                                index === display ?
                                    <div key={index}>
                                        <li className='update-container'>
                                            {/* <button
                                            className='cross todo-button'
                                            onClick={function () {
                                                deleteItem(index)
                                            }}
                                        >x</button> */}
                                            <input className='update-input' autoFocus style={{ height: "30px", padding: "5px", fontSize: '15px', textTransform: "capitalize" }} type="text" placeholder={ele} name='updatedText' onChange={(e) => setUpdatedText(e.target.value)} />

                                            <div className="update-button-container">
                                                <button onClick={() => updateData(index)}>Update</button>
                                                <button onClick={() => setDisplay(-1)}>Cancel</button>
                                            </div>
                                        </li>
                                    </div> :
                                    <div className="wrapper" key={index}>
                                        <div className='todo_style'>
                                            <button
                                                className='cross todo-button'
                                                onClick={function () {
                                                    deleteItem(index)
                                                }}
                                            >x</button>
                                            <li>{ele}</li>


                                        </div>
                                        <LuEdit style={{ cursor: "pointer", minHeight: "16px", minWidth: "16px", marginLeft: "10px" }} onClick={() => { handleEdit(index) }} />

                                    </div>
                            );
                        })}
                    </ol>
                </div>

            </div>
        </>
    )
}

export default Notes