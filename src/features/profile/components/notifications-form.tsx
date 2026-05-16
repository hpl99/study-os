"use client";

import { useTransition } from "react";
import { updateNotificationPreferences } from "../actions";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Bell, Mail } from "lucide-react";

export function NotificationsForm({ initialData }: { initialData: any }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updateNotificationPreferences(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Preferences updated successfully");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="space-y-0.5">
            <Label className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive a daily email summarizing your upcoming contests.
            </p>
          </div>
          <Switch 
            name="email_notifications_enabled" 
            defaultChecked={initialData?.email_notifications_enabled ?? true} 
          />
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Platforms to notify about</h3>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-0.5">
              <Label className="text-base">Codeforces</Label>
              <p className="text-sm text-muted-foreground">Get notified about upcoming Codeforces rounds.</p>
            </div>
            <Switch 
              name="notify_codeforces" 
              defaultChecked={initialData?.notify_codeforces ?? true} 
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-0.5">
              <Label className="text-base">LeetCode</Label>
              <p className="text-sm text-muted-foreground">Get notified about LeetCode weekly and biweekly contests.</p>
            </div>
            <Switch 
              name="notify_leetcode" 
              defaultChecked={initialData?.notify_leetcode ?? true} 
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-0.5">
              <Label className="text-base">AtCoder</Label>
              <p className="text-sm text-muted-foreground">Get notified about AtCoder beginner and regular contests.</p>
            </div>
            <Switch 
              name="notify_atcoder" 
              defaultChecked={initialData?.notify_atcoder ?? true} 
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Preferences
      </Button>
    </form>
  );
}
