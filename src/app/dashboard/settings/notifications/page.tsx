import { Bell } from "lucide-react";
import { getNotificationPreferences } from "@/features/profile/actions";
import { NotificationsForm } from "@/features/profile/components/notifications-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NotificationsPage() {
  const preferences = await getNotificationPreferences();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="w-8 h-8 text-primary" />
          Notifications
        </h1>
        <p className="text-muted-foreground">
          Manage how and when StudyOS sends you alerts and reminders.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>
            Configure your daily contest digest and alerts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationsForm initialData={preferences} />
        </CardContent>
      </Card>
    </div>
  );
}
