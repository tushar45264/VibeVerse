import getConversations from "../actions/getConversations"
import getUsers from "../actions/getUser";
import SideBar from "../components/sidebar/SideBar"
import ConversationsList from "./components/ConversationList"

export default async function ConversationsLayout({
    children
}:{
    children:React.ReactNode
}){
    const conversations=await getConversations();
    const users=await getUsers();
    return (
        <SideBar>
            <div className="h-full">
                <ConversationsList 
                users={users}
                initialItems={conversations||[]}/>
                {children}
            </div>
        </SideBar>
    )
}