import { api } from "~/services";

export default async function Page() {
  const segments = await api.campaign.list();
  return (
    <div>
      <h1>Campaigns</h1>
      <p>List of campaigns</p>
      <table>
        <thead>
          <tr>
            <th>Campaign ID</th>
            <th>Campaign Name</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((segment) => (
            <tr key={segment.id}>
              <td>{segment.id}</td>
              <td>{segment.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
