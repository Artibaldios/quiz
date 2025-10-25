"use client"

import { FormEvent } from "react";

export default async function registerForm(){
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await fetch(`api/auth/register`, {
            method: "POST",
            body: JSON.stringify({
                username: formData.get("username"),
                password: formData.get("password")
            })
        })
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mx-auto max-w-md">
            he
            <input name="username" className="bg-white text-black" type="text"/>
            <input name="password" className="bg-white text-black" type="passsword"/>
            <button type="submit">Register</button>
        </form>
    )
}