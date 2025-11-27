"use client"

import React, { useState } from 'react'
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const RegisterForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = () => {
    setSubmitting(true)
    signIn("google", { callbackUrl: `/compte`, redirect: true })
  }


  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true)

    try {
      if (password !== passwordConfirmation) {
        setError("Passwords do not match");
        return setSubmitting(false);
      }
  
      const form = { email, password };

      if(!email || !password) {
        setError("Email and password are required");
        return setSubmitting(false);
      }
  
      const response = await signIn('credentials', {
        ...form,
        callbackUrl: "/",
        redirect: false
  
      });
  
      if (response?.ok && response.url) {
        return router.push(response.url);
      } else {
        setError("Registration failed");
        return setSubmitting(false);
      }
    } catch (error) {
      setError("An error occurred while registering");
      setSubmitting(false)
    }

  }
  return (
    <form
      className='p-3 bg-white text-black flex flex-col gap-3 rounded-md max-w-3xl w-full mx-auto'
      onSubmit={handlesubmit}
    >
      <input onChange={(e) => { setEmail(e.target.value) }} type="email" name="email" id="email" className="p-2 border border-gray-300" placeholder="Email" />
      <input onChange={(e) => { setPassword(e.target.value) }} type="password" name="password" id="password" className="p-2 border border-gray-300" placeholder="Password" />
      <input onChange={(e) => { setPasswordConfirmation(e.target.value) }} type="password" name="passwordConfirmation" id="passwordConfirmation" className="p-2 border border-gray-300" placeholder="Confirm Password" />
      <button type="submit" className="p-3 mx-auto px-8">Register</button>

      <button type="button" className="p-3 mx-auto px-8" onClick={handleConnect}>Sign in with Google</button>

      <Link href="/login" className="text-blue-500">Already have an account? Login</Link>
    </form>
  )
}
