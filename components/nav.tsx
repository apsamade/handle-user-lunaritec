"use client"

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export const Navbar = () => {
    const {data: session, status} = useSession();
  return (
    <nav className='p-4 px-8 bg-white text-black flex justify-between items-center'>
        <Link href="/">Home</Link>
        <ul>
            <li>
                {status === "authenticated" ? (
                    <Link className='text-black' href={"/account"}>{session.user?.name}</Link>
                ) : status === "loading" ? (
                    <span>Loading...</span>
                ) : (
                    <Link className='text-black' href="/login">Login</Link>
                )}
            </li>
        </ul>
    </nav>
  )
}
