import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Brain, Search, Wand2 } from "lucide-react";

interface LoadingSkeletonWithProgressProps {
  jobTitle: string;
  seniority: string;
  responsibilities: string[];
  tools: string[];
}

const LoadingSkeletonWithProgress = ({
  jobTitle,
  seniority,
  responsibilities,
  tools,
}: LoadingSkeletonWithProgressProps) => {
  const [messageIndex, setMessageIndex] = useState(0);

  const loadingMessages = useMemo(() => {
    const messages: string[] = [];

    // Add personalized messages based on inputs
    if (jobTitle) {
      messages.push(`Understanding the ${jobTitle} role...`);
    }

    if (seniority) {
      messages.push(`Considering ${seniority.toLowerCase()}-level workflows...`);
    }

    if (responsibilities.length > 0) {
      const firstResp = responsibilities[0];
      messages.push(`Analyzing "${firstResp.toLowerCase()}" tasks...`);
      if (responsibilities.length > 1) {
        messages.push(`Finding patterns across ${responsibilities.length} responsibilities...`);
      }
    }

    if (tools.length > 0) {
      const toolList = tools.slice(0, 2).join(" and ");
      messages.push(`Checking ${toolList} integration options...`);
      if (tools.length > 2) {
        messages.push(`Mapping connections between ${tools.length} tools...`);
      }
    }

    // Add generic messages
    messages.push("Searching for automation opportunities...");
    messages.push("Identifying high-impact workflows...");
    messages.push("Matching AI agents to your needs...");
    messages.push("Crafting personalized recommendations...");
    messages.push("Almost there...");

    return messages;
  }, [jobTitle, seniority, responsibilities, tools]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  const icons = [Search, Brain, Wand2, Sparkles];
  const CurrentIcon = icons[messageIndex % icons.length];

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Recommendations...</h2>
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <CurrentIcon className="w-4 h-4 animate-pulse text-blue-500" />
          <p className="transition-all duration-300" key={messageIndex}>
            {loadingMessages[messageIndex]}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-gray-200 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeletonWithProgress;
