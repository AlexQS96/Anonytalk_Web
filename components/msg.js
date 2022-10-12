import { useState, useEffect, useRef } from "react";
import Linkify from "@quiq/react-linkify";
import useWindowSize from '../hooks/useWindowSize'

const Msg = ({ socket, username, room }) => {

    //window checks if the current window is a phone or a desktop
    //the main use here is prevent the enter key to send the message when the user writes in a phone
    const window = useWindowSize()
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const lastMessage = useRef(null);

    //Sends a Message with the current user data and time to the socket and set the message into the message list box
    const sendMessage = async (e) => {
        e.preventDefault()
        if (currentMessage !== "") {
          const messageData = {
            id: socket.id,
            room: room,
            author: username,
            message: currentMessage,
            time:
              (new Date(Date.now()).getHours() < 10? "0"+new Date(Date.now()).getHours() : new Date(Date.now()).getHours())
              + ":" +
              (new Date(Date.now()).getMinutes() < 10? "0"+new Date(Date.now()).getMinutes() : new Date(Date.now()).getMinutes())
          };
    
          await socket.emit("send_message", messageData);
          setMessageList((list) => [...list, messageData]);
          setCurrentMessage("");
        }
    };

    //Scroll to bottom every time someone sends a message
    useEffect(() => {
        lastMessage.current.scrollTop = lastMessage.current.scrollHeight;
      }, [messageList]);
    
    //Gets Data every time socket emit a signal
    useEffect(() => {
        socket.on("receive_message", (data) => {
          setMessageList((list) => [...list, data]);
        });

    }, [socket]);

    return (
        <section className="chat">
            <section data-type-messages ref={lastMessage}>
            {
                messageList.map((userMessage, index) => {
                    return (
                        <div data-type-msgbox key={index} className={ userMessage.author === ""? "botmsg" : socket.id === userMessage.id ? "you" : socket.id !== userMessage.id? "other" : 'other'}>
                            <Linkify properties={{target: '_blank'}}>
                                <p>{userMessage.author}</p>
                                <p>{userMessage.message}</p>
                                <p>{userMessage.time}</p>
                            </Linkify>
                        </div>
                    )
                })
            }
            </section>
            <section data-type-usermsg>
                <textarea
                    type="text"
                    value={currentMessage}
                    placeholder="Aa"
                    onChange={(e) => {
                        setCurrentMessage(e.target.value);
                    }}
                    onKeyPress={(e) => {
                        window.width > 768 &&
                        e.key === "Enter" && !e.shiftKey && sendMessage(e)
                    }}
                />
                <button className="button_1" onClick={sendMessage}>&#x23CE;</button>
            </section>
        </section>
    );
};

export default Msg;
