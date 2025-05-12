"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth.client";

export const GoogleSignInButton = () => {
    const [loading, setLoading] = React.useState(false);
    const handleGoogleSignIn = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        await authClient.signIn.social({ provider: "google" });
    };
    return (
        <Button onClick={handleGoogleSignIn} disabled={loading}>
            <GoogleIcon />
            Sign in with Google
        </Button>
    );
}

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path
            fill="#EA4335"
            d="M24 9.5c3.3 0 6.2 1.1 8.4 3.1l6.2-6.2C34.3 2.5 29.5 0 24 0 14.6 0 6.5 5.7 2.5 14l7.5 5.8C12.1 13.6 17.6 9.5 24 9.5z"
        />
        <path
            fill="#34A853"
            d="M46.1 24.5c0-1.7-.1-2.9-.4-4.2H24v7.9h12.5c-.6 3-2.4 5.4-5.1 7l7.9 6.2c4.6-4.3 7.3-10.6 7.3-17.3z"
        />
        <path
            fill="#4A90E2"
            d="M9.9 28.3c-1-2.9-1-6.1 0-9l-7.5-5.8C.9 17.1 0 20.5 0 24s.9 6.9 2.4 10l7.5-5.7z"
        />
        <path
            fill="#FBBC05"
            d="M24 48c5.5 0 10.3-1.8 13.8-4.9l-7.9-6.2c-2.2 1.5-5.1 2.3-8.3 2.3-6.4 0-11.9-4.1-13.9-9.6l-7.5 5.8C6.5 42.3 14.6 48 24 48z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
    </svg>
);