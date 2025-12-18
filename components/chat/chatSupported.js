import styles from "./chatSupported.module.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { appContext } from "@/pages/_app";
import { io } from "socket.io-client";
let socket;
export default function ChatBoxSupported() {
  const { isAuthenticated, userPayload } = useContext(appContext);
  const [loding, setLoding] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [initialList, setInitialList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // شماره چت فعلی
  const [userName, setUserName] = useState(""); // نام کاربر فعلی
  const [userId, setUserId] = useState(""); // آی‌دی کاربر فعلی
  const unreadCount = initialList.length;

  useEffect(() => {
    if (initialList.length > 0) {
      loadChat(0);
    }
  }, [initialList]);
  useEffect(() => {
    if (!isAuthenticated || !userPayload?.userId) return;

    let receiveMessageHandler;

    const initSocket = async () => {
      try {
        getMesagesHandler();

        // بیدار کردن سرور
        await axios.get("/api/socket");
        if (socket && socket.connected) {
          socket.disconnect();
        }
        socket = io({
          path: "/api/socket",
        });

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
          socket.emit("join", userPayload.userId);
        });

        receiveMessageHandler = (data) => {
          setInitialList((prev) => {
            const index = prev.findIndex(
              (chat) => chat.userId === data.userId
            );

            if (index !== -1) {
              const newList = [...prev];
              newList[index] = data;

              if (index === currentIndex) {
                setMessages(data.messages);
                setCurrentIndex(index);
                setUserName(data.name);
                setUserId(data.userId);
              }

              return newList;
            }

            return [...prev, data];
          });
          toast.success("پیام جدید دریافت شد", 5000);
        };

        socket.on("newMessage", receiveMessageHandler);
      } catch (error) {
        toast.error("اتصال به سرور چت ناموفق بود");
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.off("newMessage", receiveMessageHandler);
        socket.disconnect();
      }
    };
  }, [isAuthenticated, userPayload?.userId]);

  const loadChat = (index) => {
    const chat = initialList[index];
    if (!chat) return;

    setCurrentIndex(index);
    setMessages(chat.messages);
    setUserName(chat.name);
    setUserId(chat.userId);
  };
  const goNext = () => {
    if (currentIndex < initialList.length - 1) {
      loadChat(currentIndex + 1);
    } else {
      toast.error("چت بعدی وجود ندارد");
    }
  };
  const goPrev = () => {
    if (currentIndex > 0) {
      loadChat(currentIndex - 1);
    } else {
      toast.error("چت قبلی وجود ندارد");
    }
  };

  const getMesagesHandler = async () => {
    setLoding(true);
    await axios
      .get("/api/chatSupported")
      .then((res) => {
        if (res.status == 200) {
          setLoding(false);
          setInitialList(res.data);
        }
      })
      .catch((error) => {
        setLoding(false);
      });
  };
  const sendMessage = async (text) => {
    const createdAt = Date.now();
    setLoding(true);
    try {
      const res = await axios.post("/api/chatSupported", {
        userId: userId,
        message: {
          message: text,
          sender: "support",
        },
      });

      if (res.status == 200) {
        toast.success("پیام شما برای کاربر ارسال شد");
        setLoding(false);
        setMessages((prev) => [
          ...prev,
          {
            message: `${text}\n<span style="display:block; text-align:right;">${new Date(
              createdAt
            ).toLocaleTimeString("fa-IR", {
              hour: "2-digit",
              minute: "2-digit",
            })}</span>`,
            sender: "support",
          },
        ]);
        setInitialList((prev) => {
          const newData = [...prev];
          const target = newData[currentIndex];

          newData[currentIndex] = {
            ...target,
            messages: [
              ...target.messages,
              {
                message: `${text}\n<span style="display:block; text-align:right;">${new Date(
                  createdAt
                ).toLocaleTimeString("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}</span>`,
                sender: "support",
              },
            ],
          };

          return newData;
        });
      }
    } catch (error) {
      if (error.response) {
        if (
          error.response.status === 405 ||
          error.response.status === 422 ||
          error.response.status === 409 ||
          error.response.status === 401 ||
          error.response.status === 400 ||
          error.response.status === 429
        ) {
          setLoding(false);
          toast.error(error.response.data.message);
        } else if (error.response.status === 500) {
          setLoding(false);
          toast.error("سرور دچار مشکل شده است");
        }
      } else if (error.request) {
        setLoding(false);
        toast.error("خطا در برقراری ارتباط");
      }
      return;
    }
  };
  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 999,
        }}
      >
        {!open ? (
          <div
            style={{
              position: "relative",
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              background: "#0077FF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              fontSize: "26px",
            }}
            onClick={() => setOpen(true)}
          >
            💬
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "#fff",
                  fontSize: "12px",
                  minWidth: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 5px",
                  fontWeight: "bold",
                  boxShadow: "0 0 5px rgba(0,0,0,0.4)",
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
        ) : (
          <div
            style={{ width: "350px", height: "450px", position: "relative" }}
          >
            <MainContainer>
              <ChatContainer>
                <MessageList>
                  {messages.map((m, i) => (
                    <Message
                      key={i}
                      model={{
                        message: m.message,
                        sender: m.sender, // ⚡ user یا support
                        sentTime: m.sentTime,
                        direction:
                          m.sender === "user" ? "outgoing" : "incoming",
                      }}
                      className={
                        m.sender === "user"
                          ? styles.userMessage
                          : styles.supportMessage
                      }
                    />
                  ))}
                </MessageList>
                <MessageInput
                  placeholder="پیام خود را بنویسید..."
                  onSend={sendMessage}
                />
              </ChatContainer>
            </MainContainer>
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "60px",
                padding: "10px 10px",
                borderRadius: "6px",
                border: "none",
                background: "#868484ff",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <h1 style={{ fontSize: "20px" }}>{userName}</h1>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0",
                padding: "6px 10px",
                borderRadius: "6px",
                border: "none",
                background: "#ff4444",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
            <button
              onClick={() => goNext()}
              style={{
                position: "absolute",
                top: "-40px",
                right: "225px",
                padding: "6px 10px",
                borderRadius: "6px",
                border: "none",
                background: "#ff4444",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <FaArrowAltCircleRight size={27} />
            </button>
            <button
              onClick={() => goPrev()}
              style={{
                position: "absolute",
                top: "-40px",
                right: "295px",
                padding: "6px 10px",
                borderRadius: "6px",
                border: "none",
                background: "#ff4444",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <FaArrowAltCircleLeft size={27} />
            </button>
          </div>
        )}
        {loding ? <span className={styles.loader}></span> : ""}
      </div>
    </>
  );
}
