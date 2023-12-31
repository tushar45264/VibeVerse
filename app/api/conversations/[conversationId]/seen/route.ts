import getCurrentUser from "@/app/actions/getCurrentUser";
import Prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

interface Iparams{
    conversationId?: string;
} 
export async function POST(
    request:Request,
    {params}:{params:Iparams}
){
    try{
        const currentUser= await getCurrentUser();
        const {
            conversationId
        }=params;
        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('Unauthorized',{status:401});
        }
        //finding existing converstaion
        const conversation =await Prisma.conversation.findUnique({
            where:{
                id:conversationId
            },
            include:{
                messages:{
                    include:{
                        seen:true,
                    }
                },
                users:true,
            }
        });
        if(!conversation){
            return new NextResponse('Invalid_Id',{status:400});
        }
        //find the last messsage
        const lastMessage=conversation.messages[conversation.messages.length-1];
        if(!lastMessage){
            return NextResponse.json(conversation);
        }
        //update seen of last message
        const updatedMessage=await Prisma.message.update({
            where:{
                id:lastMessage.id
            },
            include:{
                Sender:true,
                seen:true,
            },
            data:{
                seen:{
                    connect:{
                        id:currentUser.id
                    }
                }
            }
        });
        await pusherServer.trigger(currentUser.email,'conversation:update',{
            id:conversationId,
            messages:[updatedMessage]
        });
        if(lastMessage.seenIds.indexOf(currentUser.id)!==-1){
            return NextResponse.json(conversation);
        }
        await pusherServer.trigger(conversationId!,'message:update',updatedMessage);
        return NextResponse.json(updatedMessage);
    } catch(error:any){
        console.log(error,"ERROR_MESSAGE_SEEN");
        return new NextResponse("Internal Error",{status:500});
    }
}