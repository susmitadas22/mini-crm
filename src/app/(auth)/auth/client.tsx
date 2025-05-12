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
            Sign in with Google
        </Button>
    );
}