import { Settings, Link as LinkIcon, GitBranch, Code2, Terminal } from "lucide-react";
import { getUserProfile } from "@/features/profile/actions";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const profile = await getUserProfile();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and link your coding profiles.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" /> Linked Profiles
          </CardTitle>
          <CardDescription>
            Link your external profiles to view real-time stats and analytics on your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm initialData={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
