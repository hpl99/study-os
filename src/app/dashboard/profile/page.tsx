"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type ProfileData = {
  github: string;
  leetcode: string;
  codeforces: string;
};

export default function ProfilePage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<ProfileData>({
    github: "",
    leetcode: "",
    codeforces: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("linked_profiles")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        return;
      }

      const github =
        data.find((item) => item.platform === "github")?.username || "";

      const leetcode =
        data.find((item) => item.platform === "leetcode")?.username || "";

      const codeforces =
        data.find((item) => item.platform === "codeforces")?.username || "";

      setProfile({
        github,
        leetcode,
        codeforces,
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    try {
      setSaving(true);
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("User not authenticated.");
        return;
      }

      const profiles = [
        {
          platform: "github",
          username: profile.github,
        },
        {
          platform: "leetcode",
          username: profile.leetcode,
        },
        {
          platform: "codeforces",
          username: profile.codeforces,
        },
      ];

      for (const item of profiles) {
        if (!item.username.trim()) continue;

        const { data: existing } = await supabase
          .from("linked_profiles")
          .select("*")
          .eq("user_id", user.id)
          .eq("platform", item.platform)
          .single();

        if (existing) {
          await supabase
            .from("linked_profiles")
            .update({
              username: item.username,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("linked_profiles").insert({
            user_id: user.id,
            platform: item.platform,
            username: item.username,
          });
        }
      }

      setMessage("Profiles saved successfully.");
    } catch (error) {
      console.error("Save profile error:", error);
      setMessage("Failed to save profiles.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Connect your coding profiles to enable real analytics.
        </p>
      </div>

      <div className="space-y-6">
        {/* GitHub */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            GitHub Username
          </label>

          <input
            type="text"
            value={profile.github}
            onChange={(e) =>
              setProfile({
                ...profile,
                github: e.target.value,
              })
            }
            placeholder="e.g. torvalds"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* LeetCode */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            LeetCode Username
          </label>

          <input
            type="text"
            value={profile.leetcode}
            onChange={(e) =>
              setProfile({
                ...profile,
                leetcode: e.target.value,
              })
            }
            placeholder="e.g. tourist"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Codeforces */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Codeforces Handle
          </label>

          <input
            type="text"
            value={profile.codeforces}
            onChange={(e) =>
              setProfile({
                ...profile,
                codeforces: e.target.value,
              })
            }
            placeholder="e.g. Benq"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={saveProfile}
          disabled={saving}
          className="rounded-lg bg-white text-black px-6 py-3 font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profiles"}
        </button>

        {/* Message */}
        {message && (
          <div className="text-sm text-muted-foreground">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}