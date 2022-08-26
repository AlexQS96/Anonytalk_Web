import Head from 'next/head'
import {io} from "socket.io-client";
import { useState, useEffect } from 'react';
import Chat from './chat';

const socket = io.connect("https://turbichat.herokuapp.com");
//const socket = io.connect("http://192.168.1.42:3770");

export default function Home() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [roomData, setRoomData] = useState(0);
  const [logged, setLogged] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", [username,room]);
      setLogged(true);
    }
  };

  const leaveRoom = () => {
    socket.emit('leave_room', { username, room });
    setLogged(false);
    setUsername("");
    setRoom("");
  };

  useEffect(() => {
    socket.on("room_clients", (data) => {
      setRoomData(data);
    });

  }, [socket])

  return (
    <>
      <Head>
        <title>Turbi Chat</title>
      </Head>
      <header>
        {
          logged &&
          <>
            <img className='logo' onClick={() => leaveRoom()} src='/img/hacker.svg' alt='Anonymous'/>
            <p><img src='/icons/chat.svg' alt='users'/> {room}</p>
            <p><img src='/icons/users.svg' alt='users'/> {roomData}</p>
          </>
        }
      </header>
      <main>
        {
          !logged?
          (
            <div className="login">
              <img src='/img/hacker.svg' alt='Anonymous'/>
              <h1>Bienvenido a TurbiChat</h1>
              <input
                type="text"
                placeholder="Ingresa un Nombre"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              <input
                type="text"
                placeholder="Nombre del Chat"
                onChange={(event) => {
                  setRoom(event.target.value);
                }}
              />
              <button className='btnbase btn1' onClick={joinRoom}>Unirme al Chat</button>
            </div>
          )
          :
          (
            <Chat socket={socket} username={username} room={room} />
          )
        }
      </main>
      <footer>
        <p>Chatea anonimamente</p>
      </footer>
    </>    
  )
}
