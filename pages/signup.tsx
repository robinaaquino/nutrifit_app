'use client'
import React from "react";
import signUp from "@/firebase/auth/signup";
import { useRouter } from 'next/navigation'

export default function Signup() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter()

    const handleForm = async (
      // event: any
      ) => {
        console.log('signup')
        // event.preventDefault()

        const { result, error } = await signUp(email, password);

        if (error) {
            return console.log(error)
        }

        // else successful
        console.log(result)
        // return router.push("/admin")
    }
    return (
      <>
      <div className="m-auto">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bitter text-6xl text-bold">Create an Account</h1>
          <div className="py-8">
            <label htmlFor="email" className="block">Email </label>
            <input
              name="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg bg-lime-300 text-black"
            />
            <label htmlFor="password" className="block">Password </label>
            <input
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg bg-lime-300 text-black"
            />
          </div>

          <button
          onClick={() => handleForm()}
          className="bg-lime-300 rounded-lg text-black border"
          >
            Create account
          </button>
        </div>
      </div>
      </>
    );
}