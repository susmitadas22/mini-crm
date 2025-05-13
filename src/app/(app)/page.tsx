"use client";

import { Button } from "~/components/ui/button";
import { BarChart3, Brain } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center px-6 py-16">
      {/* Hero Section */}
      <section className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          📊 Smarter Campaigns, Happier Customers
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl">
          AI-powered CRM to segment users, automate messages, and boost
          retention — all in one simple dashboard.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="/segments/create">
            <Button size="lg">🚀 Create Campaign</Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">
              See Features
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Icons */}
      <section
        id="features"
        className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full"
      >
        <Feature
          icon={<BarChart3 className="w-6 h-6 text-primary" />}
          title="Performance Insights"
          desc="Forget boring charts. We’ll summarize campaign performance in plain language with AI."
        />
        <Feature
          icon={<Brain className="w-6 h-6 text-primary" />}
          title="AI-Powered Suggestions"
          desc="Get message copy ideas, smart segment lookalikes, and timing suggestions. It's like marketing GPT."
        />
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  );
}
