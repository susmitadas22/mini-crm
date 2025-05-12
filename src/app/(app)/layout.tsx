import { redirect } from "next/navigation";
import { api } from "~/services";

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await api.user.getUser();
    if (!user) {
        return redirect('/auth');
    }
    return (
        <main>
            {children}
        </main>
    );
}   