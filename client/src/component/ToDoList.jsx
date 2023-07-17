import React, { useState } from 'react'
// import EditNoteIcon from '@mui/icons-material/EditNote';
const ToDoList = (props) => {


    return (
        <>
            <div className='todo_style'>
                <button
                    className='cross todo-button'
                    onClick={function () {
                        props.onSelect(props.id)
                    }}
                >x</button>
                <li>{props.text}</li>


            </div>
        </>
    )

}

export default ToDoList


// <ToDoList
//                                             text={ele}
//                                             key={index}
//                                             id={index}
//                                             onSelect={deleteItem}
//                                             className="todo-item"
//                                         />