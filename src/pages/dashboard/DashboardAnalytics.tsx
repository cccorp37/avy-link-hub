import { useState, useEffect } from "react";
import { Eye, MousePointerClick, Users, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type ProfileLink = Tables<"profile_links">;

interface Props { profile: Profile | null; }

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function generateMockData(days: string[]) {
  return days.map((d) => ({
    day: d,
    views: Math.floor(Math.random() * 100 + 20),
    clicks: Math.floor(Math.random() * 50 + 5),
  }));
}

export default function DashboardAnalytics({ profile }: Props) {
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [period, setPeriod] = useState<"7" | "30">("7");
  const [chartData] = useState(generateMockData(DAYS));

  useEffect(() => {
    if (!profile) return;
    supabase.from("profile_links").select("*").eq("profile_id", profile.id)
      .order("click_count", { ascending: false })
      .then(({ data }) => setLinks(data || []));
  }, [profile]);

  const totalClicks = links.reduce((s, l) => s + (l.click_count || 0), 0);

  const statCards = [
    { icon: Eye, label: "Vues", value: "1 248", change: "+12%", positive: true },
    { icon: Users, label: "Visiteurs", value: "892", change: "+8%", positive: true },
    { icon: MousePointerClick, label: "Clics totaux", value: totalClicks, change: "+5%", positive: true },
    { icon: TrendingUp, label: "CTR", value: "71%", change: "+3%", positive: true },
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Période :</span>
        {(["7", "30"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {p} jours
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border/50 shadow-card p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-4 h-4 text-muted-foreground" />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                stat.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="font-dm font-bold text-xl text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Views chart */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <h3 className="font-dm font-semibold text-base text-foreground mb-4">📈 Vues & Clics</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12 }}
            />
            <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} name="Vues" />
            <Line type="monotone" dataKey="clicks" stroke="hsl(var(--rose))" strokeWidth={2} dot={false} strokeDasharray="4 2" name="Clics" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Links performance */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <h3 className="font-dm font-semibold text-base text-foreground mb-4">🔗 Performance des liens</h3>
        {links.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucun lien pour l'instant</p>
        ) : (
          <div className="space-y-3">
            {links.map((link, i) => {
              const maxClicks = Math.max(...links.map(l => l.click_count || 0), 1);
              const pct = Math.round(((link.click_count || 0) / maxClicks) * 100);
              return (
                <div key={link.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                      <span className="font-medium text-foreground truncate">{link.title}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary ml-2 flex-shrink-0">
                      {link.click_count || 0} clics
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gradient-cta rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clics bar chart */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <h3 className="font-dm font-semibold text-base text-foreground mb-4">📊 Clics quotidiens</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12 }}
              cursor={{ fill: "hsl(var(--secondary))" }}
            />
            <Bar dataKey="clicks" fill="hsl(var(--rose))" radius={[6, 6, 0, 0]} name="Clics" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
