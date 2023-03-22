'use client'
import React, { useEffect } from "react";
import login from "@/firebase/auth/login";
import { useRouter } from 'next/navigation'

export default function Login() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter()

    const handleForm = async (
      // event: any
    ) => {
        // event.preventDefault()

        const { result, error } = await login(email, password);

        if (error) {
            return console.log(error)
        }

        // else successful
        console.log(result)
    }

    useEffect(() => {
      console.log('login')
    }, []);
    return (
      <div className="m-auto my-24 w-1/3 h-1/3 divide-y-4 space-y-1">
      <div className="space-y-1">
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          className="border border-current	"
        />
        <br />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="border border-current	"
        />
        <br />
        <button onClick={() => handleForm()}>Login</button>
      </div>
      </div>
    );
}