import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Link2, Eye, TrendingUp, UserCheck, Star } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalLinks: number;
  totalViews: number;
  premiumUsers: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalLinks: 0, totalViews: 0, premiumUsers: 0 });
  const [recentProfiles, setRecentProfiles] = useState<{ id: string; display_name: string | null; username: string | null; plan: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ count: userCount }, { count: linkCount }, { count: premiumCount }, { data: profiles }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profile_links").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).neq("plan", "free"),
        supabase.from("profiles").select("id, display_name, username, plan, created_at").order("created_at", { ascending: false }).limit(8),
      ]);
      setStats({
        totalUsers: userCount || 0,
        totalLinks: linkCount || 0,
        totalViews: 0,
        premiumUsers: premiumCount || 0,
      });
      setRecentProfiles(profiles || []);
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { icon: Users, label: "Utilisateurs totaux", value: stats.totalUsers, color: "gradient-cta", change: "Tous comptes confondus" },
    { icon: Link2, label: "Liens créés", value: stats.totalLinks, color: "gradient-primary", change: "Tous utilisateurs" },
    { icon: Star, label: "Comptes Premium", value: stats.premiumUsers, color: "gradient-rose", change: "Abonnements actifs" },
    { icon: UserCheck, label: "Taux conversion", value: stats.totalUsers > 0 ? `${Math.round((stats.premiumUsers / stats.totalUsers) * 100)}%` : "0%", color: "gradient-cta", change: "Free → Premium" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="font-dm font-bold text-2xl text-foreground">Tableau de bord Admin 🛡️</h2>
        <p className="text-muted-foreground text-sm">Vue globale de la plateforme AvyLink</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-card rounded-2xl p-5 border border-border/50 shadow-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="font-dm font-bold text-2xl text-foreground">{loading ? "..." : card.value}</div>
            <div className="text-sm font-medium text-foreground">{card.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{card.change}</div>
          </div>
        ))}
      </div>

      {/* Recent users */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <h3 className="font-dm font-semibold text-base text-foreground mb-4">Derniers utilisateurs inscrits</h3>
        {loading ? (
          <div className="flex justify-center py-8"><div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
        ) : recentProfiles.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucun utilisateur pour l'instant</p>
        ) : (
          <div className="divide-y divide-border/50">
            {recentProfiles.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                  {(p.display_name || p.username || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{p.display_name || "Sans nom"}</p>
                  <p className="text-xs text-muted-foreground truncate">@{p.username || "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${p.plan !== "free" ? "gradient-cta text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {p.plan}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {new Date(p.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
