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
      <div className="m-auto my-24 w-1/3 h-1/3 divide-y-4 space-y-1 bg-white
      ">
        <div className="space-y-1">
          <h1>Login</h1>
          <label htmlFor="email">Email </label>
          <input
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="border border-current"
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
        <button
  type="button"
  data-te-ripple-init
  data-te-ripple-color="light"
  className="rounded px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 dark:hover:bg-neutral-700">
  Link
</button>
      </div>
    );
}