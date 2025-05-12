import { redirect } from "next/navigation"
import { api } from "~/services"

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await api.user.getUser()
    if (user) {
        return redirect('/')
    }
    return (
        <main>
            {children}
        </main>
    )
}   