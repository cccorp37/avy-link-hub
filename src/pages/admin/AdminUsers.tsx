import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Star, Shield, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  plan: string;
  created_at: string;
  website: string | null;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filtered, setFiltered] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, user_id, display_name, username, bio, plan, created_at, website")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProfiles(data || []);
        setFiltered(data || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? profiles.filter(
            (p) =>
              p.display_name?.toLowerCase().includes(q) ||
              p.username?.toLowerCase().includes(q) ||
              p.bio?.toLowerCase().includes(q)
          )
        : profiles
    );
  }, [search, profiles]);

  const upgradeToPremium = async (profile: UserProfile) => {
    setUpdatingId(profile.id);
    const newPlan = profile.plan === "premium" ? "free" : "premium";
    const { error } = await supabase.from("profiles").update({ plan: newPlan }).eq("id", profile.id);
    if (!error) {
      setProfiles((prev) => prev.map((p) => (p.id === profile.id ? { ...p, plan: newPlan } : p)));
      toast({ title: newPlan === "premium" ? "✅ Compte passé en Premium" : "Plan remis en Free" });
    }
    setUpdatingId(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div>
          <h2 className="font-dm font-bold text-2xl text-foreground">Gestion des utilisateurs</h2>
          <p className="text-sm text-muted-foreground">{profiles.length} compte(s) enregistré(s)</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">Aucun utilisateur trouvé</p>
        ) : (
          <div className="divide-y divide-border/40">
            {filtered.map((profile) => (
              <div key={profile.id} className="flex items-center gap-3 px-5 py-4 hover:bg-secondary/40 transition-colors">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  {(profile.display_name || profile.username || "?")[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {profile.display_name || "Sans nom"}
                    </p>
                    {profile.plan !== "free" && (
                      <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    @{profile.username || "—"} · {new Date(profile.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                {/* Plan badge */}
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-full flex-shrink-0 ${
                    profile.plan !== "free"
                      ? "gradient-cta text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {profile.plan}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => upgradeToPremium(profile)}
                    disabled={updatingId === profile.id}
                    title={profile.plan === "premium" ? "Rétrograder en Free" : "Passer en Premium"}
                    className={`p-2 rounded-xl transition-colors ${
                      profile.plan === "premium"
                        ? "text-warning hover:bg-warning/10"
                        : "text-primary hover:bg-primary/10"
                    }`}
                  >
                    {updatingId === profile.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Star className="w-4 h-4" />
                    )}
                  </button>
                  {profile.username && (
                    <a
                      href={`/u/${profile.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-xs font-medium"
                    >
                      Voir
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
