 'use client'
 import axios from "axios";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useState,useCallback, useEffect } from "react"
import {BsGithub,BsGoogle} from 'react-icons/bs'
import { useForm , FieldValues ,SubmitHandler} from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import {toast} from "react-hot-toast";
import {signIn, useSession} from 'next-auth/react'
import { useRouter } from "next/navigation";

type Variant = 'LOGIN' | 'REGISTER';
 export const AuthFrom =()=>{
    const session = useSession();
    const router =useRouter();
    const [variant,setvariant]=useState<Variant>('LOGIN');
    const [isLoading,setIsLoading]=useState(false);
    useEffect(()=>{
        if(session?.status==='authenticated'){
            router.push('/users');
        }
    },[session?.status,router]);
    const ToggleVariant = useCallback(()=>{
        if(variant==='LOGIN'){
            setvariant('REGISTER');
        } else {
            setvariant('LOGIN');
        } 
    },[variant]);

    const {
        register,
        handleSubmit,
        formState:{errors,}
    } = useForm<FieldValues>({
        defaultValues:{
            name:"",
            email:"",
            password:"",
        }
    });
    const OnSubmit:SubmitHandler<FieldValues>=(data)=>{
        setIsLoading(true);
        if(variant ==='REGISTER'){
            axios.post('/api/register',data)
            .then(()=> signIn('credentials',data))
            .catch(()=> toast.error('Something went wrong'))
            .finally(()=> setIsLoading(false))
        } if(variant=='LOGIN'){
            signIn('credentials',{
                ...data,
                redirect:false,
            }) .then((callback)=>{
                if(callback?.error){
                    toast.error('Invalid credentials')
                } 
                if(callback?.ok && !callback?.error){
                    toast.success('Logged in successfully')
                    router.push('/users');
                }
            }) .finally(()=> setIsLoading(false));
        }
    }
    const SocialAction=(action:string)=>{
        setIsLoading(true);
        signIn(action,{redirect:false})
        .then((callback)=>{
            if(callback?.error){
                toast.error('Invalid credentials')
            }
            if(callback?.ok && !callback?.error){
                toast.success('Logged in successfully')
            }
        }) .finally(()=> setIsLoading(false));
    }
    return (
      <div className=" mt-3 sm:mx-auto sm:w-full sm:max-w-md">
        <div className=" bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className=" space-y-6" onSubmit={handleSubmit(OnSubmit)}>
            {variant==='REGISTER' &&(
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="name"
              label="Name"
            /> )}

            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="email"
              label="Email Address"
              type="email"
            /> 
             <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="password"
              label="Password"
              type="Password"
            />
            <div>
                <Button
                disabled={isLoading}
                fullWidth
                type="submit"
                >
                    {variant==='LOGIN'?'Sign in':'Register'}
                </Button>
            </div>
          </form>
          <div className=" mt-6">
                <div className="relative">
                    <div className=" absolute inset-0 flex items-center">
                        <div className=" w-full border-t border-gray-300" />
                    </div>
                    <div className=" relative flex justify-center text-sm">
                        <span className=" bg-white px-2 text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>
                <div className=" mt-6 flex gap-2">
                    <AuthSocialButton icon={BsGithub}
                    onClick={()=>SocialAction('github')}
                    />  
                    <AuthSocialButton icon={BsGoogle}
                    onClick={()=>SocialAction('google')}
                    />
                </div>
          </div>
          <div className=" flex gap-2 justify-center text-sm mt-6 text-gray-500">
                <div>
                    {variant==='LOGIN'?'New to messenger?':'Already have an account?'}
                </div>
                <div onClick={ToggleVariant} className=" underline cursor-pointer"
                >
                    {variant==='LOGIN'?'Create an account':'Login'}
                </div>
          </div>
          <h2 className=" text-sm text-gray-500 justify-center flex gap-2 mt-4">Made with ❤️ by Tushar Tiwari</h2>
        </div>
      </div>
    );
}