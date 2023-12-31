'use client'
import clsx from "clsx";
import { FullConversationType } from "@/app/types"
import { useEffect, useMemo, useState } from "react";
import {useRouter} from "next/navigation"
import UseConversation from "@/app/hooks/UseConversation";
import {MdOutlineGroupAdd} from 'react-icons/md'
import UserBox from "@/app/users/components/UserBox";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { user } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps{
    initialItems:FullConversationType[];
    users:user[];
}


const ConversationsList:React.FC<ConversationListProps> =({
    initialItems,
    users
})=>{
    const session=useSession();
    const [items,setItems]=useState(initialItems);
    const [isModelOpen,setIsModelOpen] = useState(false);
    const router =useRouter();
    const {conversationId, isOpen}=UseConversation();
    const pusherKey=useMemo(()=>{
        return session.data?.user?.email;
    },[session.data?.user?.email]);
    useEffect(()=>{
        if(!pusherKey){
            return;
        }
        pusherClient.subscribe(pusherKey);
        const newHandler=(conversation:FullConversationType)=>{
            setItems((current)=>{
                if(find(current,{id:conversation.id})){
                    return current;
                }
                return [conversation,...current];
            });
        };
        const updateHandler=(conversation:FullConversationType)=>{
            setItems((current)=>current.map((currentConversation)=>{
                if(currentConversation.id === conversation.id){
                    return {
                        ...currentConversation,
                        messages:conversation.messages
                    }
                }
                return currentConversation;
            }))
        }
        const removeHandler=(conversation:FullConversationType)=>{
            setItems((current)=>{
                return [...current.filter((convo)=>convo.id!==conversation.id)];
            })
            if(conversationId===conversation.id){
                router.push('/conversations');
            }
        };
        pusherClient.bind('conversation:new',newHandler);
        pusherClient.bind('conversation:update',updateHandler);
        pusherClient.bind('conversation:remove',removeHandler);
        return()=>{
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind('conversation:new',newHandler);
            pusherClient.unbind('conversation:update',updateHandler);
            pusherClient.unbind('conversation:remove',removeHandler);
        }
    },[pusherKey,conversationId,router]);
    return(
        <>
        <GroupChatModal users={users}
        isOpen={isModelOpen} onClose={()=>setIsModelOpen(false)} />
       <aside className={clsx(` 
       fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200
       `,isOpen? 'hidden':'block w-full left-0'
       )}>
         <div className="px-5">
                <div className=" flex justify-between mb-4 pt-4">
                    <div className="text-2xl font-bold text-neutral-900 py-4">
                       Messages
                    </div>
                    <div onClick={()=>setIsModelOpen(true)} className="rounded-full p-3 w-10 h-10 bg-gray-100 text-gray-600 hover:opacity-75 cursor-pointer transition">
                        <MdOutlineGroupAdd />
                    </div>
                </div>
                {initialItems.map((item)=>(
                    <ConversationBox key={item.id} data={item} selected={conversationId===item.id} />
                ))}
            </div>
       </aside>
       </>
    )
}

export default ConversationsList