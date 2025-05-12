import { GoogleSignInButton } from "./client";

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 shadow-md w-full max-w-md text-center">
                <h1 className="text-2xl font-semibold mb-4">Welcome to mini-crm 🚀</h1>
                <p className="text-gray-600 mb-6">Sign in to manage your campaigns, customers, and more.</p>
                <GoogleSignInButton />
            </div>
        </div>
    );
}
