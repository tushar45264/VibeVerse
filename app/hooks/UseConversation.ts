import { useParams } from "next/navigation";
import { useMemo} from "react";

const UseConversation=()=>{
    const Params =useParams();
    const conversationId=useMemo(()=>{
        if(!Params?.conversationId){
            return '';
        } 
        return Params.conversationId as string;
    },[Params?.conversationId]);
    const isOpen=useMemo(()=>!!conversationId,[conversationId]);
    return useMemo(()=>({
        isOpen,
        conversationId
    }),[isOpen,conversationId]);
} ;
export default UseConversation;