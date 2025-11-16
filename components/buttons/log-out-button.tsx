"use client"

import { signOut } from 'next-auth/react'

export const LogOutButton = () => {
    return (
        <button onClick={async () => { await signOut({ redirect: true, callbackUrl: '/' }) }} className="p-2 border border-red-500 text-red-500">
            Log Out
        </button>
    )
}
