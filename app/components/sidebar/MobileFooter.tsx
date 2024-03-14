'use client'

import UseConversation from "@/app/hooks/UseConversation";
import UseRoutes from "@/app/hooks/UserRoutes";
import MobileItem from "./MobileItem";

const MobileFooter=()=>{
    const routes =UseRoutes();
    const {isOpen}=UseConversation();
    if(isOpen){
        return null;
    }
    return (
        <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
            {routes.map((route)=>(
                <MobileItem 
                key={route.href}
                href={route.href}
                active={route.active}
                icon={route.icon}
                onClick={route.onClick}
                />
            ))}
        </div>
    )
}

export default MobileFooter;