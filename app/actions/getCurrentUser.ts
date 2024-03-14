import Prisma from "../libs/prismadb";
import getSession from "./getSession";

const getCurrentUser= async()=>{
    try{
        const session=await getSession();
        if(!session?.user?.email){
            return null;
        }  
        const CurrentUser=await Prisma.user.findUnique({
            where:{
                email: session.user.email as string,
            }
        });
        if(!CurrentUser){
            return null;
        } 
        return CurrentUser;
    } catch(error:any){
        return null;
    }
}

export default getCurrentUser;