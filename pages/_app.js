import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import "antd/dist/reset.css";
import { Provider } from "react-redux";
import store from "@/Redux/store";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { createContext, useEffect, useState } from "react";
import OffCanvasMenu from "@/components/offCanvasMenu/OffCanvasMenu";
import ChatBox from "@/components/chat/chat";
import { Toaster } from "react-hot-toast";
import ChatBoxSupported from "@/components/chat/chatSupported";
import ValidateToken from "@/utils/auth";
export const appContext = createContext();
export default function App({ Component, pageProps, payload }) {
  const [openAndClose, setOpenAndClose] = useState("close");
  const [isAuthenticated, setIsAuthenticated] = useState(
    payload ? true : false
  );
  const [userPayload, setUserPayload] = useState(payload);
  const [state, setState] = useState(false);
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            filter: "none",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
            transform: "none", // ❗️غیرفعال کردن transform سه‌بعدی
            willChange: "auto",
            backfaceVisibility: "hidden",
            perspective: "none",
            WebkitFontSmoothing: "antialiased", // متن شفاف‌تر
            MozOsxFontSmoothing: "grayscale",
          },
          success: {
            iconTheme: {
              primary: "rgb(3, 157, 3)",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#f44336",
              secondary: "#fff",
            },
          },
        }}
      />
      <Provider store={store}>
        <appContext.Provider
          value={{
            setOpenAndClose,
            openAndClose,
            isAuthenticated,
            setIsAuthenticated,
            userPayload,
            setUserPayload,
            setState,
            state,
          }}
        >
          <Header />
          <Component {...pageProps} />
          {userPayload?.role === "admin" ? <ChatBoxSupported /> : <ChatBox />}
          <Footer />
          {!openAndClose && <OffCanvasMenu />}
        </appContext.Provider>
      </Provider>
    </>
  );
}
App.getInitialProps = async ({ ctx, Component }) => {
  let pageProps = {};

  
  const payload = ValidateToken(ctx);

  
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return {
    pageProps,
    payload, 
  };
};
