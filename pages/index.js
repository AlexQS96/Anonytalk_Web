import Head from 'next/head'
import {io} from "socket.io-client";
import { useState } from 'react';
import Chat from './Chat';

const socket = io.connect("http://192.168.1.42:3770");

export default function Home() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [logged, setLogged] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setLogged(true);
    }
  };


  return (
    <>
      <Head>
        <title>Turbi Chat</title>
      </Head>
      <main>
        {
          !logged?
          (
            <div className="login">
              <img src='/img/hacker.svg' alt='Anonymous'/>
              <h1>Bienvenido a TurbiChat</h1>
              <h3>El Chat Turbina de la WEB Profunda</h3>
              <input
                type="text"
                placeholder="Ingresa un Nick"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              <input
                type="text"
                placeholder="ID del Chat"
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
        <p>Desarrollado por "Hoy es dia de no se que Development Studios"</p>
        <p>Producido por "Ay Nose Productions"</p>
        <p>- 2022 -</p>
      </footer>
    </>    
  )
}
