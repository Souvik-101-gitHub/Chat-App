
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import ChatBox from '../../components/ChatBox/ChatBox'
import RightSidebar from '../../components/RightSidebar/RightSidebar'
import { AppContext } from '../../context/AppContext'
function Chat() {

  const { chatData,userData, rightSidebarVisible } = useContext(AppContext);
  const [loading,setLoading] = useState(true);


  useEffect(()=>{
    if(chatData && userData){
      setLoading(false);
    }
  },[chatData,userData])


  return (

    <div className='chat'>
    {
      loading
      ?<p className='loading'>Loading...</p>
      :<div className={`chat-container ${rightSidebarVisible ? "with-sidebar" : ""}`}>
      <LeftSidebar/>
      <ChatBox/>
      { rightSidebarVisible  && <RightSidebar/>}
      
    </div>
    }
    
  
    </div>
  )
}

export default Chat
