import { useState, useEffect, useRef } from "react";
import Linkify from "@quiq/react-linkify";

const Chat = ({ socket, username, room }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const lastMessage = useRef(null);

    const sendMessage = async () => {
        if (currentMessage !== "") {
          const messageData = {
            room: room,
            author: username,
            message: currentMessage,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              (new Date(Date.now()).getMinutes() < 9? "0"+new Date(Date.now()).getMinutes() : new Date(Date.now()).getMinutes())
          };
    
          await socket.emit("send_message", messageData);
          setMessageList((list) => [...list, messageData]);
          setCurrentMessage("");
        }
    };

    useEffect(() => {
        lastMessage.current.scrollTop = lastMessage.current.scrollHeight;
      }, [messageList]);
    
    useEffect(() => {
        socket.on("receive_message", (data) => {
          setMessageList((list) => [...list, data]);
        });

    }, [socket]);

    return (
        <div className="chat_box">
            <div className="messages_box" ref={lastMessage}>
            {
                messageList.map((userMessage, index) => {
                    return (
                        <div className="message" key={index} id={username === userMessage.author ? "you" : username !== userMessage.author && userMessage.author !== ''? "other" : userMessage.author === '' && "botmsg"}>
                            <Linkify>
                                <p>{userMessage.author}</p>
                                <p className="message_text">{userMessage.message}</p>
                                <p id="time">{userMessage.time}</p>
                            </Linkify>
                        </div>
                    )
                })
            }
            </div>
            <div className="userText">
                <textarea
                    type="text"
                    value={currentMessage}
                    placeholder="Escribi algo"
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                />
                <button className="btnbase btn2" onClick={sendMessage}>&#x23CE;</button>
            </div>
        </div>
    );
};

export default Chat;
