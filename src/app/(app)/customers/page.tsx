import { api } from "~/services"

export default async function Page() {
    const customers = await api.customer.list()
    return (
        <div>
            <h1>Customers</h1>
            <p>Welcome to the customers page!</p>
            <ul>
                {customers.map((customer) => (
                    <li key={customer.id}>
                        {customer.email}
                    </li>
                ))}
            </ul>
        </div>

    )
}