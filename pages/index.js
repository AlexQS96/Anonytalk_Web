import Head from 'next/head'
import {io} from "socket.io-client";
import { useRef, useState, useEffect } from 'react';
import Msg from '../components/msg';
import { GithubLogo, LinkedinLogo, LogoAlex, PageLogo, WhatsappLogo, ChatLogo, UsersLogo } from '../components/PageIcons';

const socket = io.connect("https://anonytalk.onrender.com");
//const socket = io.connect("http://192.168.1.40:3770");

export default function Home() {
  const userInput = useRef();
  const roomInput = useRef();
  const sendInput = useRef();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(0);
  const [roomData, setRoomData] = useState(0);
  const [logged, setLogged] = useState(false);
  const [errors, setErrors] = useState(false);

  function nextInput(e,opt) {
    e.which = e.which || e.keyCode;
    if (e.which == 13) {
      switch (opt) {
        case "userInput":
          roomInput.current.focus();
          break;
        case "sendInput":
          sendInput.current.focus();
          break;
        default:
          break;
      }
    }
  }

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
            <div data-type-logo onClick={() => leaveRoom()}>
            <PageLogo/>
            </div>
            <p data-type-logo><ChatLogo/> {room}</p>
            <p data-type-logo><UsersLogo/> {roomData}</p>
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
                    ref={userInput}
                    className={errors? 'invalid' : undefined}
                    type="text"
                    placeholder="Fulanito"
                    onKeyUp={(e) => nextInput(e, 'userInput')}
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                  />
                  
                  <label>Chat ID</label>
                  <input
                    ref={roomInput}
                    type="text"
                    placeholder="Ej: 1337"
                    onKeyUp={(e) => nextInput(e, 'sendInput')}
                    onChange={(event) => {
                      setRoom(event.target.value);
                    }}
                  />
                  <button
                    ref={sendInput}
                    className='button_1' 
                    onClick={joinRoom}

                    onKeyPress={(e) => {
                      e.key === "Enter" && joinRoom()
                    }}
                  >
                    Iniciar Chat
                  </button>
                </section>
              </div>

              <div data-type-logo-bg>
                <PageLogo/>
              </div>
            </div>
          )
          :
          (
            <Msg socket={socket} username={username} room={room} />
          )
        }
      </main>
      <footer>
        <div className={logged? 'chatOn social' : 'social'}>
          <a href='https://github.com/alexqs96' target="_blank" rel="noreferrer noopener"><GithubLogo/></a>
          <a href='https://www.linkedin.com/in/alexander-mamani/' target="_blank" rel="noreferrer noopener"><LinkedinLogo/></a>
          <a href='https://wa.me/+5491122636544' target="_blank" rel="noreferrer noopener"><WhatsappLogo/></a>
          <a href='https://alexqs96.vercel.app' target="_blank" rel="noreferrer noopener"><LogoAlex/></a>
        </div>
      </footer>
    </>
  )
}
