"use client";

import { useState } from "react";
import { GitBranch, Code2, Terminal, Loader2, Link as LinkIcon, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { linkProfile, unlinkProfile } from "../actions";
import { toast } from "sonner";

interface LinkedProfile {
  platform: string;
  handle: string;
}

export function ProfileForm({ linkedProfiles }: { linkedProfiles: LinkedProfile[] }) {
  const getHandle = (platform: string) => linkedProfiles.find(p => p.platform === platform)?.handle || "";

  return (
    <div className="space-y-6">
      <ProfileLinkRow 
        platform="GitHub" 
        icon={<GitBranch className="w-4 h-4" />} 
        initialHandle={getHandle("GitHub")} 
        placeholder="torvalds" 
      />
      <ProfileLinkRow 
        platform="LeetCode" 
        icon={<Code2 className="w-4 h-4 text-yellow-500" />} 
        initialHandle={getHandle("LeetCode")} 
        placeholder="tourist" 
      />
      <ProfileLinkRow 
        platform="Codeforces" 
        icon={<Terminal className="w-4 h-4 text-blue-500" />} 
        initialHandle={getHandle("Codeforces")} 
        placeholder="tourist" 
      />
    </div>
  );
}

function ProfileLinkRow({ platform, icon, initialHandle, placeholder }: { platform: "GitHub" | "LeetCode" | "Codeforces", icon: React.ReactNode, initialHandle: string, placeholder: string }) {
  const [handle, setHandle] = useState(initialHandle);
  const [isPending, setIsPending] = useState(false);
  const isLinked = !!initialHandle;

  async function handleLink() {
    if (!handle.trim()) return toast.error("Please enter a handle");
    
    setIsPending(true);
    const result = await linkProfile(platform, handle.trim());
    setIsPending(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`${platform} linked successfully!`);
    }
  }

  async function handleUnlink() {
    setIsPending(true);
    const result = await unlinkProfile(platform);
    setIsPending(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setHandle("");
      toast.success(`${platform} unlinked.`);
    }
  }

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {icon} {platform} Handle
      </Label>
      <div className="flex items-center gap-2">
        <Input 
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder={placeholder} 
          disabled={isLinked || isPending}
          className="bg-white/5 border-white/10" 
        />
        {isLinked ? (
          <Button type="button" variant="destructive" onClick={handleUnlink} disabled={isPending} className="shrink-0 gap-2 w-[110px]">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink className="w-4 h-4" />}
            Unlink
          </Button>
        ) : (
          <Button type="button" variant="default" onClick={handleLink} disabled={isPending || !handle.trim()} className="shrink-0 gap-2 w-[110px]">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
            Link
          </Button>
        )}
      </div>
    </div>
  );
}
