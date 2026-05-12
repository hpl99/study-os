"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProblem } from "../types";

const DIFFICULTY_COLORS = {
  Easy: "#10b981",
  Medium: "#eab308",
  Hard: "#ef4444"
};

const PLATFORM_COLORS = {
  LeetCode: "#f59e0b",
  Codeforces: "#3b82f6",
  CodeChef: "#8b5cf6",
  AtCoder: "#22c55e",
  Other: "#6b7280"
};

export function AnalyticsDashboard({ data }: { data: UserProblem[] }) {
  const difficultyStats = data.reduce((acc, curr) => {
    acc[curr.difficulty] = (acc[curr.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const difficultyData = Object.keys(difficultyStats).map(key => ({
    name: key,
    value: difficultyStats[key]
  }));

  const platformStats = data.reduce((acc, curr) => {
    acc[curr.platform] = (acc[curr.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const platformData = Object.keys(platformStats).map(key => ({
    name: key,
    value: platformStats[key]
  }));

  const totalTime = data.reduce((acc, curr) => acc + (curr.time_taken_mins || 0), 0);

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Difficulty Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          {difficultyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DIFFICULTY_COLORS[entry.name as keyof typeof DIFFICULTY_COLORS] || "#8884d8"} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Platform Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          {platformData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name as keyof typeof PLATFORM_COLORS] || "#8884d8"} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{data.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {Math.floor(totalTime / 60)}<span className="text-lg text-muted-foreground">h</span> {totalTime % 60}<span className="text-lg text-muted-foreground">m</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
