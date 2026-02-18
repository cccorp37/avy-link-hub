import { Bell, Search, Eye, Menu } from "lucide-react";
import { useState } from "react";
import avylinkLogo from "@/assets/avylink-logo.jpg";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/supabase-auth";
import { useNavigate } from "react-router-dom";
import AuthModal from "@/components/AuthModal";

type Profile = Tables<"profiles">;

interface Props {
  profile: Profile | null;
  title: string;
  onMobileMenuOpen?: () => void;
}

export function DashboardTopbar({ profile, title, onMobileMenuOpen }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const profileUrl = profile?.username ? `${window.location.origin}/u/${profile.username}` : null;

  return (
    <header className="h-14 px-4 md:px-6 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile logo */}
        <div className="flex md:hidden items-center gap-2">
          <img src={avylinkLogo} alt="AvyLink" className="w-7 h-7 rounded-lg object-cover" />
          <span className="font-dm font-bold text-sm text-foreground">Avy<span className="text-gradient">Link</span></span>
        </div>
        <h1 className="hidden md:block font-dm font-bold text-lg text-foreground">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {profileUrl && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-border hover:bg-secondary hover:text-primary text-muted-foreground transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Voir le profil
          </a>
        )}

        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold cursor-pointer"
          title={user?.email}>
          {(profile?.display_name || user?.email || "U")[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
