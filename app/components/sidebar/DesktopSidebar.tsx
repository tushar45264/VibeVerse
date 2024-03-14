'use client'

import UseRoutes from "@/app/hooks/UserRoutes";
import { useRouter } from "next/router";
import { useState } from "react";
import DesktopItem from "./DesktopItem";
import { user } from "@prisma/client";
import Avatar from "../Avatar";
import SettingsModal from "./SettingsModal";
interface DesktopSidebarProps{
    currentUser: user;
}

const DesktopSidebar:React.FC<DesktopSidebarProps>=({
    currentUser
})=>{
    const routes = UseRoutes();
    const [isOpen,setIsOpen]=useState(false);
    // console.log({currentUser});
    return(
        <>
        <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={()=>setIsOpen(false)} />
        <div className=" hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
            <nav className=" mt-4 flex flex-col justify-between">
                <ul
                role="list" className=" flex flex-col items-center space-y-1">
                    {routes.map((item)=>(
                        <DesktopItem 
                        key={item.label}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={item.active}
                        onClick={item.onClick}
                        />
                    ))}
                </ul>
            </nav>
            <nav className=" mt-4 flex flex-col justify-between items-center">
            <div className=" cursor-pointer hover:opacity-75 transition"
             onClick={()=>setIsOpen(true)}>
                <Avatar user={currentUser}/>
            </div>
            </nav>
        </div>
        </>
    )
}
export default DesktopSidebar;