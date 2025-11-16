"use client"

import React, { useState } from 'react'
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export const RegisterForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            alert("Passwords do not match");
            return;
        }

        const form = { email, password };

        const response = await signIn('credentials', {
            ...form,
            callbackUrl: "/",
            redirect: false

        });

        if (response?.ok) {
            console.log("Registered successfully");
        } else {
            console.log("Registration failed");
        }
    }
    return (
        <form 
        className='p-3 bg-white text-black flex flex-col gap-3' 
        onSubmit={handlesubmit}
        >
            <input onChange={(e) => {setEmail(e.target.value)}} type="email" name="email" id="email" className="p-2 border border-gray-300" placeholder="Email" />
            <input onChange={(e) => {setPassword(e.target.value)}} type="password" name="password" id="password" className="p-2 border border-gray-300" placeholder="Password" />
            <input onChange={(e) => {setPasswordConfirmation(e.target.value)}} type="password" name="passwordConfirmation" id="passwordConfirmation" className="p-2 border border-gray-300" placeholder="Confirm Password" />
            <button type="submit" className="p-3 mx-auto px-8">Register</button>

            <button type="button" className="p-3 mx-auto px-8" onClick={async () => await signIn('google', { callbackUrl: "/" })}>Sign in with Google</button>

            <Link href="/login" className="text-blue-500">Already have an account? Login</Link>
        </form>
    )
}
