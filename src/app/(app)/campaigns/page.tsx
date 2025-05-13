import { api } from "~/services";
import { Campaign } from "./client";

export default async function Page() {
  const campaigns = await api.campaign.list();
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">📢 Your Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => {
          return <Campaign key={campaign.id} segment={campaign} />;
        })}
      </div>
    </div>
  );
}
