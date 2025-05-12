import { api } from "~/services"

export default async function Page() {
    const orders = await api.order.list()
    return (
        <div>
            <h1>Customers</h1>
            <p>Welcome to the orders page!</p>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        {order.customer.email} - {order.amount}
                    </li>
                ))}
            </ul>
        </div>

    )
}