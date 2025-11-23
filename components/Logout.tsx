"use client"
import { signOut } from "next-auth/react";

export default function Home() {
    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };
    return (
    <button onClick={handleLogout} className="btn-logout">
        Logout
    </button>
    )
}