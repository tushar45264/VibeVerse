'use client'
import clsx from "clsx"
import UseConversation from "@/app/hooks/UseConversation"
import EmptyState from "@/app/components/EmptyState"

const Home=()=>{
    const {isOpen}=UseConversation();

    return (
        <div className={clsx("lg:pl-80 h-full lg:block",isOpen?'block':'hidden')}>
            <EmptyState />
        </div>
    )
}

export default Home