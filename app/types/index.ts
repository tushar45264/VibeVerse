import { Conversation,Message,user } from "@prisma/client";

export type FullMessageType=Message & {
    sender:user,
    seen:user[]
};

export type FullConversationType=Conversation & {
    users:user[],
    messages:FullMessageType[],
};