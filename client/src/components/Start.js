import React, { useContext } from "react";
import { AppContext } from "../App";
import '../styles/Start.css';

// The Start component displays the initial form for entering user information.
// It allows users to provide their name and choose a room before joining the chat.
export default function Start({ signHandler }) {
    // Accessing context to get and set shared state variables
    const { name, setName, room, setRoom } = useContext(AppContext);
    
    return (
        <div className="start-container">
            <h1>Secure <span> Chat Rooms </span></h1>
            <form className="submit-form">
                {/* Input field for entering the user's name */}
                <input type="text" placeholder="Enter your name*" value={name} onChange={(e) => setName(e.target.value)}></input>
                {/* Input field for entering the room number */}
                <input type="text" placeholder="Enter the room number*" value={room} onChange={(e) => setRoom(e.target.value)}></input>
                {/* Button to join the selected chat room */}
                <button onClick={signHandler}> Join the room </button>
            </form>
        </div>
    );
}
