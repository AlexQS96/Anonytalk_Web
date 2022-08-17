import { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Linkify from "@quiq/react-linkify";

const chat = ({ socket, username, room }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

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
        socket.on("receive_message", (data) => {
          setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <div className="chat_box">
            
            <div className="messages_box">
                <ScrollToBottom>
                {
                    messageList.map((userMessage, index) => {
                        return (
                            <div className="message" key={index} id={username === userMessage.author ? "you" : "other"}>
                                <Linkify>
                                    <p>{userMessage.author}</p>
                                    <p className="message_text">{userMessage.message}</p>
                                    <p id="time">{userMessage.time}</p>
                                </Linkify>
                            </div>
                        )
                    })
                }
                </ScrollToBottom>
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

export default chat;
