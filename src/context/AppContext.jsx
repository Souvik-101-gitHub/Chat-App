

/* eslint-disable react-refresh/only-export-components */
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messagesId,setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser,setChatUser] = useState(null);
  const [chatVisible,setChatVisible] = useState(false);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);

  // 🔹 Load User Data
  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;

      const data = userSnap.data();

      setUserData({ ...data, id: uid }); // ✅ include id

      if (data.avatar && data.name) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }

      await updateDoc(userRef, {
        lastSeen: Date.now()
      });

      setInterval(async () => {
        if (auth.currentUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now()
          });
        }
      }, 60000);

    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Listen to chats when userData is ready
  useEffect(() => {
    if (!userData?.id) return; // ✅ Prevent error

    const chatRef = doc(db, "chats", userData.id);

    const unSub = onSnapshot(chatRef, async (res) => {
      if (!res.exists()) return;

      const chatItems = res.data().chatsData || [];
      const tempData = [];

      for (const item of chatItems) {
        const userRef = doc(db, "users", item.rId);
        const userSnap = await getDoc(userRef);
        const receiverData = userSnap.data();

        tempData.push({ ...item, userData: receiverData });
      }

      setChatData(
        tempData.sort((a, b) => b.updatedAt - a.updatedAt)
      );
    });

    return () => unSub();

  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,setMessages,
    messagesId,setMessagesId,
    chatUser,setChatUser,
    chatVisible,setChatVisible,
    rightSidebarVisible,setRightSidebarVisible
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
