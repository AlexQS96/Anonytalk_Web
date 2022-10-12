import Head from 'next/head'
import {io} from "socket.io-client";
import { useState, useEffect } from 'react';
import Msg from '../components/msg';

//const socket = io.connect("https://anonytalkserver.herokuapp.com");
const socket = io.connect("http://192.168.1.40:3770");

export default function Home() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(0);
  const [roomData, setRoomData] = useState(0);
  const [logged, setLogged] = useState(false);
  const [errors, setErrors] = useState(false);

  const joinRoom = () => {
    if (username !== "") {
      socket.emit("join_room", [username,room]);
      setLogged(true);
      setErrors(false);
    }
    else
    {
      setErrors(true)
    }
  };

  const leaveRoom = () => {
    socket.emit('leave_room', { username, room });
    setLogged(false);
    setUsername("");
    setRoom(0);
  };

  useEffect(() => {
    socket.on("room_clients", (data) => {
      setRoomData(data);
    });

  }, [socket])

  return (
    <>
      <Head>
        <title>Anonytalk Chat</title>
      </Head>
      <header>
        {
          logged &&
          <>
            <img data-type-logo onClick={() => leaveRoom()} src='/icons/logo.svg' alt='Anonymous'/>
            <p data-type-icon><img src='/icons/chat.svg' alt='users'/> {room}</p>
            <p data-type-icon><img src='/icons/users.svg' alt='users'/> {roomData}</p>
          </>
        }
      </header>
      <main>
        {
          !logged?
          (
            <div className='home'>
              <div data-type-user-index>
                <div data-type-headline>
                  <h1>Anonytalk</h1>
                  <h4>Chatea Anonimamente :)</h4>
                </div>
                <section className="login">
                  <label>Nick</label>
                  <input
                    className={errors? 'invalid' : undefined}
                    type="text"
                    placeholder="Fulanito"
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                  />
                  
                  <label>Chat ID</label>
                  <input
                    type="text"
                    placeholder="Ej: 1337"
                    onChange={(event) => {
                      setRoom(event.target.value);
                    }}
                  />
                  <button className='button_1' onClick={joinRoom}>Iniciar Chat</button>
                </section>
              </div>

              <img data-type-logo-bg src='/icons/logo.svg' alt='Anonymous'/>
            </div>
          )
          :
          (
            <Msg socket={socket} username={username} room={room} />
          )
        }
      </main>
      <footer>
        <div className='social'>
          <a href='https://github.com/alexqs96' target="_blank" rel="noreferrer noopener"><img src="/icons/github.svg" alt="Github Icon" title="Visita mi Perfil en Github"/></a>
          <a href='https://www.linkedin.com/in/alexander-mamani/' target="_blank" rel="noreferrer noopener"><img src="/icons/linkedin.svg" alt="LinkedIn Icon" title="Agregame en Linkedin"/></a>
          <a href='https://wa.me/+5491122636544' target="_blank" rel="noreferrer noopener"><img src="/icons/whatsapp.svg" alt="Whatsapp Icon" title="Hablemos en Whatsapp"/></a>
          <a href='https://www.facebook.com/profile.php?id=100041428520951' target="_blank" rel="noreferrer noopener"><img src="/icons/facebook.svg" alt="Facebook Icon" title="Agregame en Facebook"/></a>
        </div>
      </footer>
    </>    
  )
}
