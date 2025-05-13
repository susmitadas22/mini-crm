"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Eye, Bot, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Segment } from "~/generated/prisma";

const generateInsight = async (campaignId: string) => {
  const response = await fetch("/api/insight", {
    method: "POST",
    body: JSON.stringify({ campaignId }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  return data.insight;
};

export const Campaign: React.FC<{ segment: Segment }> = ({
  segment: campaign,
}) => {
  const [open, setOpen] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const openModal = () => {
    setInsight(null);
    setOpen(true);
  };

  const handleInsight = async () => {
    setLoadingInsight(true);
    try {
      const result = await generateInsight(campaign.id);
      setInsight(result);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoadingInsight(false);
    }
  };
  const audience = (campaign.audience as string[]) || [];
  return (
    <>
      <Card
        key={campaign.id}
        className="cursor-pointer"
        onClick={() => openModal()}
      >
        <CardHeader>
          <CardTitle>{campaign.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2">
            {campaign.message}
          </p>
          <div className="mt-2 text-sm flex items-center justify-between">
            <span>📨 {audience.length} recipients</span>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
            <p className="text-muted-foreground text-sm">{campaign.name}</p>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm">{campaign.message}</p>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-medium">👥 Audience Size: {audience.length}</p>
            </div>
          </div>

          {insight ? (
            <div className="mt-4 p-4 border rounded-md bg-green-50 text-sm text-green-900">
              🧠 <strong>AI Insight:</strong> {insight}
            </div>
          ) : (
            <DialogFooter>
              <Button
                onClick={handleInsight}
                className="w-1/2"
                disabled={loadingInsight}
              >
                {loadingInsight ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Generating...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 mr-2" /> Generate Insights
                  </>
                )}
              </Button>
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="w-1/2"
              >
                Close
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
