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
import { Trash2, Plus } from "lucide-react";
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
  const [loading, setLoading] = React.useState<boolean>(false);
  const { control, register, handleSubmit } = form;
  const {
    fields: ruleFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "rules",
  });

  const [audience, setAudience] = React.useState<Customer[]>([]);
  const router = useRouter();

  const onSubmit = async (data: CreateSegmentSchema) => {
    if (!data.rules || data.rules.length === 0 || audience.length === 0) {
      toast.error(
        "Please add at least one rule and fetch audience before saving."
      );
      return;
    }
    setLoading(true);
    await createSegment(data)
      .then(async () => {
        router.push("/campaigns");
      })
      .catch((error) => {
        toast.error("Failed to create segment: " + error.message);
      })
      .finally(() => setLoading(false));
  };

  const fetchAudience = async () => {
    const data = form.getValues();
    if (!data.rules || data.rules.length === 0) {
      toast.error("Please add at least one rule to fetch audience.");
      return;
    }
    const audiencePreview = await getAudiencePreview(data.rules);
    setAudience(audiencePreview);
    toast.success("Audience fetched successfully!");
  };

  const [suggestInput, setSuggestInput] = React.useState<string>("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

  const fetchMessageSuggestion = async () => {
    if (loading || ruleFields.length === 0 || suggestInput.length === 0) return;
    setLoading(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rules: ruleFields, input: suggestInput }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }
      const data = await response.json();
      setSuggestions(data.suggestions);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Failed to fetch suggestions: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-3xl w-full mx-auto">
      <h2 className="text-xl font-bold">Segment Rule Builder</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Input placeholder="Segment Name" {...register("segmentName")} />
          <div>
            <Input
              placeholder="Type to get message suggestions..."
              value={suggestInput}
              onChange={(e) => setSuggestInput(e.target.value)}
              onBlur={fetchMessageSuggestion}
            />
            {suggestions.length > 0 && (
              <div className="absolute bg-white border rounded-md shadow-lg mt-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      form.setValue("message", suggestion);
                      setSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <Textarea placeholder="Message" {...register("message")} />
            <span className="text-xs">
              use {`{email}`} to insert the customer&apos;s email
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {ruleFields.map((field, index) => (
            <Card key={field.id} className="flex items-center p-4">
              <Select
                {...register(`rules.${index}.field` as const)}
                onValueChange={(value) => {
                  form.setValue(`rules.${index}.field`, value);
                }}
                defaultValue={field.field}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Field" />
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
                {...register(`rules.${index}.operator` as const)}
                onValueChange={(value) => {
                  form.setValue(`rules.${index}.operator`, value);
                }}
                defaultValue={field.operator}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Value"
                {...register(`rules.${index}.value` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
                className="w-full"
              >
                <span>Remove Rule</span>
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => append({ field: "", operator: "", value: "" })}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Rule
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full my-2"
          onClick={fetchAudience}
        >
          Preview Audience
        </Button>
        {audience.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold">Audience Preview</h3>
            <table className="min-w-full mt-4">
              <thead>
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Phone</th>
                </tr>
              </thead>
              <tbody>
                {audience.map((user) => (
                  <tr key={user.id}>
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {audience.length > 0 && (
          <Button type="submit" className="w-full" disabled={loading}>
            Save Segment
          </Button>
        )}
      </form>
    </div>
  );
}
