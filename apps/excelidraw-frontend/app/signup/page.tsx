"use client"
import { Pencil } from "lucide-react";
import { BottomWarning } from "../components/ui/BottamWarnind";
import { Button } from "../components/ui/button";
import { InputBox } from "../components/ui/InputBox";
import React, { useRef, useState } from 'react';
import axios from "axios";
import { useRouter } from "next/navigation";
import { ExButton } from "../components/ui/ExButton";

export default function Signup() {

  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup: () => Promise<void> = async () => {
    setError(null);
    setLoading(true);
    try {
      const username = emailRef.current?.value || "";
      const name = nameRef.current?.value || "";
      const password = passwordRef.current?.value || "";

      if (!username || !name || !password) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      await axios.post("http://localhost:3001/signup", {
        username,
        name,
        password
      });

      router.push("/signin");

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Signup failes"
      )
    } finally {
      setLoading(false);
    }
  }

  return <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="font-roboto bg-white shadow-2xl rounded-2xl px-8 py-8 w-full max-w-sm flex flex-col gap-4">
      <div className="text-center flex flex-col pb-4 items-center ">
        <div className="shadow-md mb-4 w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
          <Pencil className="h-5 w-5 text-white" />
        </div>
        <span className="font-semibold text-2xl  text-gray-900">Welcome!</span>
        <span className="font-light text-sm text-gray-600">Enter your credentials to kick start.</span>
      </div>
      <InputBox 
       placeholder="example@gmail.com"
       label="Email"
        type="text"
        ref={emailRef} />
      <InputBox 
      placeholder="Jhon"
       label="Name"
        type="text"
        ref={nameRef} />
      <InputBox 
       placeholder="Password"
        label="Password"
         type="password"
         ref={passwordRef} />
         {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="pt-4">
        <ExButton size="xl" variant="primary" text="Signup" onClick={handleSignup}/>
      </div>
      <BottomWarning label={"You have an account?"} buttonText={"Sign in"} to={"signin"} />
    </div>
  </div>
}