"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card } from "~/components/ui/card";
import { Trash2, Plus, Users, Save, Eye } from "lucide-react";
import { createSegmentSchema, CreateSegmentSchema } from "~/schemas";
import { Customer } from "~/generated/prisma";
import { toast } from "sonner";
import { createSegment, getAudiencePreview } from "./action";
import { useRouter } from "next/navigation";
import { Textarea } from "~/components/ui/textarea";

const fields = ["total_spend", "order_count", "last_order_date"];
const operators = ["greater_than", "less_than", "equal_to"];

export function RuleBuilderForm() {
  const form = useForm<CreateSegmentSchema>({
    resolver: zodResolver(createSegmentSchema),
    defaultValues: {
      segmentName: "",
      message: "",
      rules: [{ field: "", operator: "", value: "" }],
    },
  });

  const { control, register, handleSubmit } = form;
  const {
    fields: ruleFields,
    append,
    remove,
  } = useFieldArray({ control, name: "rules" });

  const [loading, setLoading] = React.useState(false);
  const [audience, setAudience] = React.useState<Customer[]>([]);
  const router = useRouter();

  const onSubmit = async (data: CreateSegmentSchema) => {
    if (!data.rules?.length || !audience.length) {
      toast.error("Add at least one rule and fetch audience first.");
      return;
    }
    setLoading(true);
    try {
      await createSegment(data);
      router.push("/campaigns");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error("Segment creation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAudience = async () => {
    const data = form.getValues();
    if (!data.rules.length) {
      toast.error("Add at least one rule to preview audience.");
      return;
    }
    const audiencePreview = await getAudiencePreview(data.rules);
    setAudience(audiencePreview);
    toast.success("Audience fetched 🎯");
  };

  // 🔮 Message Suggestion AI
  const [suggestInput, setSuggestInput] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

  const fetchMessageSuggestion = async () => {
    if (loading || !ruleFields.length || !suggestInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: ruleFields, input: suggestInput }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error("Suggestion failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          🎯 Segment Builder
        </h2>
        <p className="text-muted-foreground">
          Define your target audience with rules + let AI craft the perfect
          message.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          placeholder="Segment Name (e.g. High Spenders)"
          {...register("segmentName")}
        />

        <div className="relative">
          <Input
            placeholder="Type your campaign objective to get AI message suggestions"
            value={suggestInput}
            onChange={(e) => setSuggestInput(e.target.value)}
            onBlur={fetchMessageSuggestion}
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-2 w-full bg-white dark:bg-zinc-900 border rounded shadow-lg">
              {suggestions.map((msg, i) => (
                <div
                  key={i}
                  onClick={() => {
                    form.setValue("message", msg);
                    setSuggestions([]);
                  }}
                  className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                >
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Textarea
            rows={4}
            placeholder="Your message (e.g. 'Hey {email}, we miss you! Get 10% off today.')"
            {...register("message")}
          />
          <p className="text-xs mt-1 text-muted-foreground">
            Use <code>{`{email}`}</code> to insert customer email dynamically.
          </p>
        </div>

        {/* Rule List */}
        <div className="space-y-4">
          {ruleFields.map((field, index) => (
            <Card
              key={field.id}
              className="flex flex-col md:flex-row items-center gap-3 p-4"
            >
              <Select
                defaultValue={field.field}
                onValueChange={(val) =>
                  form.setValue(`rules.${index}.field`, val)
                }
              >
                <SelectTrigger className="w-full md:w-1/3">
                  <SelectValue placeholder="Select Field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                defaultValue={field.operator}
                onValueChange={(val) =>
                  form.setValue(`rules.${index}.operator`, val)
                }
              >
                <SelectTrigger className="w-full md:w-1/3">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Value"
                {...register(`rules.${index}.value`)}
                className="w-full md:w-1/3"
              />

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </Card>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ field: "", operator: "", value: "" })}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Rule
          </Button>
        </div>

        {/* Audience Fetch */}
        <Button
          type="button"
          variant="outline"
          onClick={fetchAudience}
          className="w-full"
        >
          <Eye className="mr-2 h-4 w-4" /> Preview Audience
        </Button>

        {audience.length > 0 && (
          <>
            <div className="mt-6 border rounded-md p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" /> Audience Preview (
                {audience.length})
              </h3>
              <div className="max-h-64 overflow-y-auto text-sm">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-2 py-1 font-medium">Name</th>
                      <th className="px-2 py-1 font-medium">Email</th>
                      <th className="px-2 py-1 font-medium">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audience.map((u) => (
                      <tr key={u.id} className="border-b">
                        <td className="px-2 py-1">{u.name}</td>
                        <td className="px-2 py-1">{u.email}</td>
                        <td className="px-2 py-1">{u.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-4">
              <Save className="mr-2 h-4 w-4" />
              Save Segment
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
