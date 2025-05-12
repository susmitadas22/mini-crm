import { api } from "~/services";

export default async function Home() {
  const user = await api.user.getUser();
  return (
    <div>
      <pre>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
