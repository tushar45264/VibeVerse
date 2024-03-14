import getCurrentUser from "@/app/actions/getCurrentUser";
import Prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";
export async function POST(
    request:Request
) {
    try{
        const currentUser=await getCurrentUser();
        const body=await request.json();
        const {
            message,
            image,
            conversationId
        }=body;
        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('Unauthorized',{status:401});
        }
        const newMessage=await Prisma.message.create({
            include: {
                seen: true,
                Sender: true
              },
              data: {
                body: message,
                image: image,
                conversation: {
                  connect: { id: conversationId }
                },
                Sender: {
                  connect: { id: currentUser.id }
                },
                seen: {
                  connect: {
                    id: currentUser.id
                  }
                },
              }
        });
        const updatedConversation=await Prisma.conversation.update({
            where:{
                id:conversationId,
            },
            data:{
                lastMessageAt:new Date(),
                messages:{
                    connect:{
                        id: newMessage.id,
                    }
                }
            },
            include:{
                users:true,
                messages:{
                    include:{
                        seen:true
                    }
                }
            }
        });

        await pusherServer.trigger(conversationId,'messages:new',newMessage);
        const lastMessage=updatedConversation.messages[updatedConversation.messages.length-1];
        updatedConversation.users.map((user)=>{
            pusherServer.trigger(user.email!,'conversation:update',{
                id:conversationId,
                messages:[lastMessage]
            });
        });
        return NextResponse.json(newMessage);
    } catch(error:any){
        console.log(error,'Error_MESSAGES');
        return new NextResponse('InternalError',{status:500})
    }
}