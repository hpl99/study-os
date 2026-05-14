"use client";

import { useEffect, useState } from "react";
import { Bell, Save } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function NotificationsPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [preferences, setPreferences] = useState({
    dailyDSA: true,
    contestReminders: true,
    revisionReminders: true,
    email: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPreferences();
  }, []);

  async function fetchPreferences() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setPreferences({
          dailyDSA: data.daily_dsa,
          contestReminders: data.contest_reminders,
          revisionReminders: data.revision_reminders,
          email: data.email || "",
        });
      } else {
        setPreferences((prev) => ({
          ...prev,
          email: user.email || "",
        }));
      }
    } catch (error) {
      console.error("Notification fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function savePreferences() {
    try {
      setSaving(true);
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const payload = {
        user_id: user.id,
        daily_dsa: preferences.dailyDSA,
        contest_reminders: preferences.contestReminders,
        revision_reminders: preferences.revisionReminders,
        email: preferences.email,
        updated_at: new Date().toISOString(),
      };

      const { data: existing } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        await supabase
          .from("notification_preferences")
          .update(payload)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("notification_preferences")
          .insert(payload);
      }

      setMessage("Notification preferences saved successfully.");
    } catch (error) {
      console.error("Save preferences error:", error);
      setMessage("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading notification settings...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Bell className="h-8 w-8" />

        <div>
          <h1 className="text-3xl font-bold">
            Notification Preferences
          </h1>

          <p className="text-muted-foreground mt-1">
            Manage your email reminders and productivity alerts.
          </p>
        </div>
      </div>

      {/* Settings Card */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Notification Email
          </label>

          <input
            type="email"
            value={preferences.email}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                email: e.target.value,
              })
            }
            placeholder="Enter your email"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <ToggleItem
            title="Daily DSA Reminders"
            description="Receive daily coding reminders."
            checked={preferences.dailyDSA}
            onChange={() =>
              setPreferences({
                ...preferences,
                dailyDSA: !preferences.dailyDSA,
              })
            }
          />

          <ToggleItem
            title="Contest Reminders"
            description="Get notified before contests begin."
            checked={preferences.contestReminders}
            onChange={() =>
              setPreferences({
                ...preferences,
                contestReminders:
                  !preferences.contestReminders,
              })
            }
          />

          <ToggleItem
            title="Revision Reminders"
            description="Receive revision and spaced repetition reminders."
            checked={preferences.revisionReminders}
            onChange={() =>
              setPreferences({
                ...preferences,
                revisionReminders:
                  !preferences.revisionReminders,
              })
            }
          />
        </div>

        {/* Save Button */}
        <button
          onClick={savePreferences}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-white text-black px-6 py-3 font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          <Save className="h-4 w-4" />

          {saving ? "Saving..." : "Save Preferences"}
        </button>

        {/* Status Message */}
        {message && (
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

type ToggleProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

function ToggleItem({
  title,
  description,
  checked,
  onChange,
}: ToggleProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-4">
      <div>
        <h3 className="font-medium">{title}</h3>

        <p className="text-sm text-muted-foreground mt-1">
          {description}
        </p>
      </div>

      <button
        onClick={onChange}
        className={`h-6 w-12 rounded-full transition relative ${
          checked ? "bg-green-500" : "bg-muted"
        }`}
      >
        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}