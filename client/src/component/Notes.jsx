import React, { useState, useEffect } from 'react'
import axios from 'axios'
import "./notes.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { LuEdit } from 'react-icons/lu';

const BASE_URL = "https://note-app-da8z.onrender.com"

const Notes = () => {
    const [updatedText, setUpdatedText] = useState('')


    const location = useLocation()
    const history = useNavigate()

    const { first_name, email } = location.state.id
    const [nota, setNota] = useState([])

    // console.log(nota)

    const updateData = async (id) => {
        if (updatedText.trim() === "") {
            alert("Enter the task")
            return;
        }
        await axios.post(BASE_URL + "/update", { id, email, updatedText })
            .then((res) => {
                if (res.data === "updated") {
                    // console.log("reload kr")
                    // fetchNotes()
                    window.location.reload()
                }
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

    const fetchNotes = async () => {
        try {
            // console.log(email)
            await axios.post(BASE_URL + "/notes", { email })
                .then((res) => {
                    // console.log(res.data)
                    setNota(res.data)
                })

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchNotes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [newItem, setNewItem] = useState('');

    // const [items, setItems] = useState(nota);

    function changeHandler(event) {
        const value = event.target.value;
        setNewItem(value);
    }

    const handleLogout = () => {
        history("/")
    };


    function addItems() {
        if (newItem.trim() === "")
            alert("Enter the task")
        else {

            axios.post(BASE_URL + "/note", { email, newItem })
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

        await axios.post(BASE_URL + "/note/delete", { id, email })
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
                <h1 className='heading'>Hello {first_name}</h1>
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
                                index === display ? <div key={index}>
                                    <li>
                                        <button
                                            className='cross todo-button'
                                            onClick={function () {
                                                deleteItem(index)
                                            }}
                                        >x</button>
                                        <input className='update-input' autoFocus style={{ height: "30px", padding: "5px", fontSize: '15px', textTransform: "capitalize" }} type="text" placeholder={ele} name='updatedText' onChange={(e) => setUpdatedText(e.target.value)} />

                                        <button style={{ padding: '5px', margin: '5px' }} onClick={() => updateData(index)}>Update</button>
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