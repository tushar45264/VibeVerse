'use client'
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { user } from "@prisma/client";

const useOtherUser=(conversation:FullConversationType|{
    users:user[],
})=>{
    const session =useSession();
    const otherUser=useMemo(()=>{
        const CurrentUserEmail =session?.data?.user?.email;
        const otherUserEmail=conversation.users.filter((user)=>user.email!==CurrentUserEmail);
        return otherUserEmail[0];
    },[session?.data?.user?.email,conversation.users]);
    return otherUser;
}

export default useOtherUser;