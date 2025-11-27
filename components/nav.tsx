"use client"

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export const Navbar = () => {
    const { data: session, status } = useSession();
    return (
        <nav>
            <div className='p-4 px-8 flex justify-between items-center'>
                <Link href="/">Home</Link>
                <ul>
                    <li>
                        {status === "authenticated" ? (
                            <Link className='' href={"/account"}>{session.user?.name}</Link>
                        ) : status === "loading" ? (
                            <span>Loading...</span>
                        ) : (
                            <Link className='' href="/login">Login</Link>
                        )}
                    </li>
                </ul>
            </div>
            <hr className='bg-white/20 border-white/20 mx-5' />
        </nav>
    )
}
