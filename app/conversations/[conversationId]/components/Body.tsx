"use client";

import UseConversation from "@/app/hooks/UseConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}
const Body: React.FC<BodyProps> = ({ initialMessages=[]}) => {
  const [messages, setMessages] = useState(initialMessages);
  const BottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = UseConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    BottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
            return current;
          }
        return [...current, message];
      });
      BottomRef?.current?.scrollIntoView();
    };
    const updateMessageHandler=(newMessage:FullMessageType)=>{
        setMessages((current)=>current.map((currentMessage)=>{
            if(currentMessage.id===newMessage.id){
                return newMessage;
            }
            return currentMessage;
        }));
    };
    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);
  return (
    <div className=" flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={BottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
