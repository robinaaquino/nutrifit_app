import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { getAllUsers } from '../firebase/services/users_services'
import React, { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  useEffect(() => {
    getAllUsers().then(
      result => {
        console.log(result)
      }
    )

    if(process.env.TEST_KEY === `uwu`) {
      console.log('This is a test')
    }
  }, []);

  return (
    <>
      <main></main>
      {/* <h1 className="text-3xl font-bold underline ">
        Hello world!
      </h1> */}
    </>
  )
}
