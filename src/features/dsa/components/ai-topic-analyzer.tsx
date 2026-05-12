"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProblem } from "../types";
import { analyzeWeakTopics } from "@/services/ai/gemini";
import ReactMarkdown from "react-markdown";

export function AITopicAnalyzer({ problems }: { problems: UserProblem[] }) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAnalyze = () => {
    startTransition(async () => {
      // Extract unique topic tags
      const topics = Array.from(new Set(problems.flatMap((p) => p.topic_tags || [])));
      const result = await analyzeWeakTopics(topics);
      setAnalysis(result);
    });
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 backdrop-blur-xl mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles className="w-32 h-32 text-purple-500" />
      </div>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" /> AI Coach Analysis
        </CardTitle>
        <CardDescription>
          Get personalized recommendations on what topics to study next based on your solved problems.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <Button 
            onClick={handleAnalyze} 
            disabled={isPending || problems.length === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing your skills...
              </>
            ) : (
              "Analyze My Progress"
            )}
          </Button>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
