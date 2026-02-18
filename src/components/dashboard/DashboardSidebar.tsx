import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Link2,
  Palette,
  BarChart3,
  Settings,
  LogOut,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
  LayoutTemplate,
  Plug,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { signOut } from "@/lib/supabase-auth";
import { useNavigate } from "react-router-dom";
import avylinkLogo from "@/assets/avylink-logo.jpg";
import { useState } from "react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const navItems = [
  { to: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard, end: true },
  { to: "/dashboard/page", label: "Ma Page", icon: User },
  { to: "/dashboard/liens", label: "Liens", icon: Link2 },
  { to: "/dashboard/modeles", label: "Modèles", icon: LayoutTemplate },
  { to: "/dashboard/apparence", label: "Apparence", icon: Palette },
  { to: "/dashboard/integrations", label: "Intégrations", icon: Plug },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/parametres", label: "Paramètres", icon: Settings },
];

interface Props {
  profile: Profile | null;
}

export function DashboardSidebar({ profile }: Props) {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const profileUrl = profile?.username
    ? `${window.location.origin}/u/${profile.username}`
    : null;

  const isPremium = profile?.plan && profile.plan !== "free";

  return (
    <aside
      className={`hidden md:flex flex-col bg-card border-r border-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      } relative flex-shrink-0`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center z-10 hover:bg-secondary transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 h-14 border-b border-border flex-shrink-0 ${collapsed ? "justify-center" : ""}`}>
        <img src={avylinkLogo} alt="AvyLink" className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
        {!collapsed && (
          <span className="font-dm font-bold text-base text-foreground">
            Avy<span className="text-gradient">Link</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-primary/10 text-primary border-l-[3px] border-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground border-l-[3px] border-transparent"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Admin link (only for admins) */}
        {isAdmin && (
          <NavLink
            to="/admin"
            title={collapsed ? "Admin" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border-l-[3px] ${
              location.pathname.startsWith("/admin")
                ? "bg-destructive/10 text-destructive border-destructive"
                : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive border-transparent"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <Shield className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Administration</span>}
          </NavLink>
        )}
      </nav>

      {/* View profile link */}
      {!collapsed && profileUrl && (
        <div className="px-3 py-2">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
          >
            <Eye className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Voir mon profil public</span>
          </a>
        </div>
      )}

      {/* Upgrade CTA (free users only, not admin) */}
      {!isPremium && !collapsed && !isAdmin && (
        <div className="mx-3 mb-3 p-3 rounded-2xl bg-primary/5 border border-primary/15">
          <div className="flex items-center gap-2 mb-1.5">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Plan Gratuit</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Passe à Premium pour débloquer toutes les fonctionnalités
          </p>
          <button className="w-full py-1.5 text-xs font-semibold gradient-cta text-primary-foreground rounded-lg">
            Passer à Premium
          </button>
        </div>
      )}

      {/* Admin badge in sidebar (only for admins) */}
      {isAdmin && !collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-2xl bg-destructive/5 border border-destructive/20">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-destructive" />
            <span className="text-xs font-semibold text-destructive">Accès Admin</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Toutes les fonctionnalités débloquées.</p>
        </div>
      )}

      {/* User footer */}
      <div className={`border-t border-border px-3 py-3 flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
          {(profile?.display_name || user?.email || "U")[0].toUpperCase()}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {profile?.display_name || user?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {isAdmin ? "Administrateur" : profile?.plan || "free"}
              </p>
            </div>
            <button
              onClick={async () => { await signOut(); navigate("/"); }}
              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
