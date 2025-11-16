"use client"

import { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface ProviderProps {
    children: ReactNode;
    session: any;
}
export const Provider: FC<ProviderProps> = ({ children, session }) => {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}
