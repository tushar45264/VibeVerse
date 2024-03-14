import Prisma from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationByid=async(
    conversationId:string,
)=>{
    try{
        const currentUser=await getCurrentUser();
        if(!currentUser?.email){
            return null;
        }
        const conversation =await Prisma.conversation.findUnique({
            where:{
                id:conversationId,
            },
            include:{
                users:true
            }
        });
        return conversation;
    } catch(error:any){
        return null;
    }
}

export default getConversationByid;