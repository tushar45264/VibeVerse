import Prisma from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
    const currentUser = await getCurrentUser();
    if(!currentUser){
        return [];
    } 
    try{
        const conversations = await Prisma.conversation.findMany({
            orderBy:{
                lastMessageAt: 'desc'
            },
            where:{
                userIds:{
                    has:currentUser.id
                }
            },
            include:{
                users:true,
                messages:{
                    include:{
                        Sender:true,
                        seen:true
                    }
                }
            }
        });
        return conversations;
    } catch(err){
        return null;
    }
}

export default getConversations