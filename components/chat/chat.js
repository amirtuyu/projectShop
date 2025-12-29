import styles from "./chat.module.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { io } from "socket.io-client";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { appContext } from "@/pages/_app";
import { TbMessageReportFilled } from "react-icons/tb";
let socket;
export default function ChatBox() {
  const { isAuthenticated, userPayload } = useContext(appContext);
  const [loding, setLoding] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [flagNotf, setFlagNotf] = useState(false);
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
          console.log(data);
          setMessages((prev) => [...prev, data]);
          setFlagNotf(true);
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

  const notfHandler = async () => {
    if (!flagNotf) return;

    try {
      const res = await axios.put("/api/chat");
      if (res.status === 200) {
        setFlagNotf(false);
      }
    } catch (error) {
      setFlagNotf(false);
    }
  };
  const appendMessage = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };
  const getMesagesHandler = async () => {
    setLoding(true);
    await axios
      .get("/api/chat")
      .then((res) => {
        if (res.status == 200) {
          setLoding(false);
          if (res.data.messages) {
            setMessages(res.data.messages);
          }
          setFlagNotf(res.data.flagNotf);
        }
      })
      .catch((error) => {
        setLoding(false);
        if (error.response && error.response.status === 401) {
          setMessages([]);
        }
      });
  };
  const sendMessage = async (text) => {
    setLoding(true);
    try {
      const formData = new FormData();
      formData.append("type", "text");
      formData.append("sender", "user");
      formData.append("content", text);
      const res = await axios.post("/api/chat", formData);

      if (res.status == 200) {
        toast.success("پیام ارسال شد");
        setLoding(false);
        appendMessage(res.data.message);
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
  const sendImageMessage = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("فقط ارسال فایل تصویری مجاز است");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("حجم عکس نباید بیشتر از ۵ مگابایت باشد");
      return;
    }

    setLoding(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", "image");
      formData.append("sender", "user");

      const res = await axios.post("/api/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("عکس ارسال شد");
        appendMessage(res.data.message);
      }
    } catch (err) {
      toast.error("ارسال عکس ناموفق بود");
    } finally {
      setLoding(false);
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
          <div style={{ position: "relative" }}>
            {flagNotf ? (
              <TbMessageReportFilled
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  fontSize: "28px",
                  color: "red",
                }}
              />
            ) : (
              ""
            )}

            <button
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                fontSize: "26px",
                background: "#0077FF",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
              onClick={async () => {
                setOpen(true);
                notfHandler();
              }}
            >
              💬
            </button>
          </div>
        ) : (
          <div
            style={{ width: "350px", height: "450px", position: "relative" }}
          >
            <input
              type="file"
              accept="image/*"
              id="chat-image-upload"
              style={{ display: "none" }}
              onChange={(e) => sendImageMessage(e.target.files[0])}
            />

            <MainContainer>
              <ChatContainer>
                <MessageList>
                  {(messages || []).map((m, i) => {
                    if (m.type === "text") {
                      return (
                        <Message
                          key={i}
                          model={{
                            message: m.content,
                            direction:
                              m.sender === "user" ? "outgoing" : "incoming",
                          }}
                          className={
                            m.sender === "user"
                              ? styles.userMessage
                              : styles.supportMessage
                          }
                        />
                      );
                    }

                    if (m.type === "image") {
                      return (
                        <Message
                          key={i}
                          type="image"
                          className={styles.customImageMessage}
                          model={{
                            direction:
                              m.sender === "user" ? "outgoing" : "incoming",
                            payload: {
                              src: m.content,
                            },
                          }}
                        />
                      );
                    }

                    return null;
                  })}
                </MessageList>
                <MessageInput
                  placeholder="پیام خود را بنویسید..."
                  onSend={sendMessage}
                  attachButton
                  onAttachClick={() =>
                    document.getElementById("chat-image-upload").click()
                  }
                />
              </ChatContainer>
            </MainContainer>
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
          </div>
        )}
        {loding ? <span className={styles.loader}></span> : ""}
      </div>
    </>
  );
}
