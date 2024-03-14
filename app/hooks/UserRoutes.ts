import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import {HiChat} from 'react-icons/hi';
import {HiArrowLeftOnRectangle,HiUsers} from 'react-icons/hi2';
import { signOut } from "next-auth/react";
import UseConversation from "./UseConversation";

const UseRoutes=()=>{
    const pathname=usePathname();
    const {conversationId}=UseConversation();
    const routes=useMemo(()=>[
        {
            label:'chat',
            href:'/conversations',
            icon:HiChat,
            active:pathname==='/conversations'|| !!conversationId
        },{
            label:'users',
            href:'/users',
            icon:HiUsers,
            active:pathname==='/users'
        },{
            label:'Logout',
            href:'#',
            onClick:()=>signOut(),
            icon:HiArrowLeftOnRectangle,
        }
    ],[pathname,conversationId]);
    return routes;
}

export default UseRoutes;