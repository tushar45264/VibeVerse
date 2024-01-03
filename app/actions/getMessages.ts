import Prisma from "../libs/prismadb";

const getMessages=async(
    conversationId:string,
)=>{
    try{
        const messages=await Prisma.message.findMany({
            where:{
                conversationId:conversationId,
            },
            include:{
                Sender:true,
                seen:true,
            },
            orderBy:{
                createdAt:'asc'
            }
        });
        return messages;
    } catch(error:any){
        return null;
    }
}

export default getMessages;