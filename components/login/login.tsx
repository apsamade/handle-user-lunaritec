"use client"

import React, { useState } from 'react'
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export const LoginForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = { email, password };
    const response = await signIn('credentials', {
      ...form,
      callbackUrl: "/",
      redirect: false

    });

    if (response?.ok) {
      console.log("Logged in successfully");
    } else {
      console.log("Login failed");
    }
  }
  return (
    <form
      className='p-3 bg-white text-black flex flex-col gap-3 rounded-md max-w-3xl w-full mx-auto'
      onSubmit={handlesubmit}
    >
      <input onChange={(e) => { setEmail(e.target.value) }} type="email" name="email" id="email" className="p-2 border border-gray-300" placeholder="Email" />
      <input onChange={(e) => { setPassword(e.target.value) }} type="password" name="password" id="password" className="p-2 border border-gray-300" placeholder="Password" />
      <button type="submit" className="p-3 mx-auto px-8">Register</button>

      <button type="button" className="p-3 mx-auto px-8" onClick={async () => await signIn('google')}>Sign in with Google</button>

      <Link href="/register" className="text-blue-500">Don't have an account? Register</Link>
    </form>
  )
}
