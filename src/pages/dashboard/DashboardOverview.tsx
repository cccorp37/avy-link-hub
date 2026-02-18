import { useEffect, useState } from "react";
import { Eye, Users, MousePointerClick, TrendingUp, ArrowUp, Link2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type ProfileLink = Tables<"profile_links">;

interface Props { profile: Profile | null; }

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="flex items-center gap-1 text-xs text-success font-medium bg-success/10 px-2 py-0.5 rounded-full">
          <ArrowUp className="w-3 h-3" />
          {sub}
        </span>
      </div>
      <div className="font-dm font-bold text-2xl text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

export default function DashboardOverview({ profile }: Props) {
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [viewData] = useState(
    DAYS.map((d) => ({ day: d, views: Math.floor(Math.random() * 80 + 10) }))
  );

  useEffect(() => {
    if (!profile) return;
    supabase.from("profile_links").select("*").eq("profile_id", profile.id)
      .order("click_count", { ascending: false }).limit(5)
      .then(({ data }) => setLinks(data || []));
  }, [profile]);

  const totalClicks = links.reduce((s, l) => s + (l.click_count || 0), 0);
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Bonjour" : now.getHours() < 18 ? "Bon après-midi" : "Bonsoir";
  const displayName = profile?.display_name || profile?.username || "toi";
  const dateStr = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Greeting */}
      <div>
        <h2 className="font-dm font-bold text-2xl text-foreground">
          {greeting}, {displayName} 👋
        </h2>
        <p className="text-muted-foreground text-sm capitalize">{dateStr}</p>
      </div>

      {/* Profile URL quick copy */}
      {profile?.username && (
        <div className="glass-blue rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-foreground truncate">
              avylink.app/u/{profile.username}
            </span>
          </div>
          <button
            className="text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors flex-shrink-0"
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/u/${profile.username}`)}
          >
            Copier le lien
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Vues totales" value="1 248" sub="+12%" color="gradient-cta" />
        <StatCard icon={Users} label="Visiteurs uniques" value="892" sub="+8%" color="gradient-primary" />
        <StatCard icon={MousePointerClick} label="Clics liens" value={totalClicks || 0} sub="+5%" color="gradient-rose" />
        <StatCard icon={TrendingUp} label="Taux de clic" value="71%" sub="+3%" color="gradient-cta" />
      </div>

      {/* Chart */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <h3 className="font-dm font-semibold text-base text-foreground mb-4">Vues des 7 derniers jours</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={viewData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12 }}
              cursor={{ fill: "hsl(var(--secondary))" }}
            />
            <Bar dataKey="views" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top links */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
          <h3 className="font-dm font-semibold text-base text-foreground mb-4">Top Liens</h3>
          {links.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              <Link2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Aucun lien encore
            </div>
          ) : (
            <div className="space-y-2">
              {links.map((link, i) => (
                <div key={link.id} className="flex items-center gap-3 py-2">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary flex-shrink-0">
                    {link.click_count || 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
          <h3 className="font-dm font-semibold text-base text-foreground mb-4">Actions Rapides</h3>
          <div className="space-y-2">
            {[
              { label: "Ajouter un nouveau lien", href: "/dashboard/liens", icon: "🔗" },
              { label: "Personnaliser l'apparence", href: "/dashboard/apparence", icon: "🎨" },
              { label: "Voir mon profil public", href: profile?.username ? `/u/${profile.username}` : "#", icon: "👁️", target: "_blank" },
              { label: "Voir mes analytics", href: "/dashboard/analytics", icon: "📊" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                target={action.target}
                rel={action.target ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors group"
              >
                <span className="text-lg">{action.icon}</span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {action.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade banner (free plan) */}
      {(!profile?.plan || profile?.plan === "free") && (
        <div className="gradient-cta rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-primary-foreground" />
              <span className="font-dm font-bold text-primary-foreground text-sm">Passe à Premium</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Débloques analytics avancés, thèmes premium, domaine custom et bien plus.
            </p>
          </div>
          <button className="px-5 py-2 bg-white text-primary font-semibold text-sm rounded-xl hover:bg-primary-foreground/90 transition-colors flex-shrink-0">
            Voir les plans
          </button>
        </div>
      )}
    </div>
  );
}
