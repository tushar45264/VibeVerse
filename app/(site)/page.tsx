import Image from "next/image";
import { AuthFrom } from "./components/AuthFrom";

export default function Home() {
    return (
      <div className="
        flex
        min-h-full
        flex-col
        justify-center
        py-12 sm:px-6
        lg:px-8
       bg-custom 
      ">
        <div className=" sm:mx-auto sm:w-full sm:max-w-md mb-2">
            <Image alt="Logo" height="50" width="50" className=" mx-auto w-80" src="/images/logo3.svg"/>
            <h2 className="ml-20 text-center text-sm font-bold tracking-tight text-gray-900">
            </h2>
        </div>
        <AuthFrom/>
      </div>
    )
  }
  