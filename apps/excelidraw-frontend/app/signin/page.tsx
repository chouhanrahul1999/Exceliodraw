"use client"
import { Pencil } from "lucide-react";
import { BottomWarning } from "../components/ui/BottamWarnind";
import { Button } from "../components/ui/button";
import { InputBox } from "../components/ui/InputBox";
import React, { useRef, useState } from 'react';
import axios from "axios";
import { useRouter } from "next/navigation";
import { ExButton } from "../components/ui/ExButton";

export default function Signin() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignin = async () => {
    setError(null);
    setLoading(true);
    try {
      const username = emailRef.current?.value || "";
      const password = passwordRef.current?.value || "";

      if (!username || !password) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      const res = await axios.post("http://localhost:3001/signin", {
        username,
        password
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        router.push("/room");
      } else {
        setError("Invalid credentials");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Signin failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="font-roboto bg-white shadow-2xl rounded-2xl px-8 py-8 w-full max-w-sm flex flex-col gap-4">
      <div className="text-center flex flex-col pb-4 items-center ">
        <div className="shadow-md mb-4 w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
          <Pencil className="h-5 w-5 text-white" />
        </div>
        <span className="font-semibold text-2xl  text-gray-900">Welcome back!</span>
        <span className="font-light text-sm text-gray-600">Enter your credentials to kick start.</span>
      </div>
      <InputBox 
       placeholder="example@gmail.com"
       label="Email"
        type="text"
        ref={emailRef} />
      <InputBox 
       placeholder="Password"
        label="Password"
         type="password"
         ref={passwordRef} />
         {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="pt-4">
        <ExButton size="xl" variant="primary" text="Signin" onClick={handleSignin}/>
      </div>
      <BottomWarning label={"Don't have an account?"} buttonText={"Create one"} to={"signup"} />
    </div>
  </div>
}