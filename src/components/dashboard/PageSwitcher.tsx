import { useState } from "react";
import { Plus, ChevronDown, FileText, Check, Crown, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  starter: 3,
  premium: 999,
};

interface Props {
  profiles: Profile[];
  activeProfile: Profile | null;
  onSwitch: (profile: Profile) => void;
  onCreated: (profile: Profile) => void;
  onDeleted: (profileId: string) => void;
  collapsed?: boolean;
}

export function PageSwitcher({ profiles, activeProfile, onSwitch, onCreated, onDeleted, collapsed }: Props) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const currentPlan = activeProfile?.plan || "free";
  const limit = PLAN_LIMITS[currentPlan] || 1;
  const canCreate = profiles.length < limit;
  const isPaidPlan = currentPlan !== "free";

  const handleCreate = async () => {
    if (!newName.trim() || !newUsername.trim()) {
      toast({ title: "Remplis le nom et le nom d'utilisateur", variant: "destructive" });
      return;
    }

    const slug = newUsername.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (slug.length < 3) {
      toast({ title: "Le nom d'utilisateur doit faire au moins 3 caractères", variant: "destructive" });
      return;
    }

    setLoading(true);
    // Check username availability
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", slug)
      .maybeSingle();

    if (existing) {
      toast({ title: "Ce nom d'utilisateur est déjà pris", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        display_name: newName.trim(),
        username: slug,
        plan: currentPlan, // inherit plan from current
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Erreur lors de la création", description: error.message, variant: "destructive" });
    } else if (data) {
      onCreated(data);
      setCreating(false);
      setNewName("");
      setNewUsername("");
      toast({ title: "Nouvelle page créée !" });
    }
    setLoading(false);
  };

  const handleDelete = async (profileId: string) => {
    if (profiles.length <= 1) {
      toast({ title: "Tu ne peux pas supprimer ta seule page", variant: "destructive" });
      return;
    }
    setDeleting(profileId);
    // Delete related data first
    await supabase.from("page_blocks").delete().eq("profile_id", profileId);
    await supabase.from("profile_links").delete().eq("profile_id", profileId);
    await supabase.from("page_views").delete().eq("profile_id", profileId);

    const { error } = await supabase.from("profiles").delete().eq("id", profileId);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      onDeleted(profileId);
      toast({ title: "Page supprimée" });
    }
    setDeleting(null);
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto"
        title="Mes pages"
      >
        <FileText className="w-4 h-4 text-primary" />
      </button>
    );
  }

  return (
    <div className="px-3 py-2">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/60 hover:border-primary/30 transition-all text-left group"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            {activeProfile?.display_name || "Ma page"}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {profiles.length} page{profiles.length > 1 ? "s" : ""} · {limit === 999 ? "∞" : limit} max
          </p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-1.5 space-y-0.5 py-1">
              {profiles.map((p) => (
                <div key={p.id} className="flex items-center gap-1 group/item">
                  <button
                    onClick={() => { onSwitch(p); setOpen(false); }}
                    className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      p.id === activeProfile?.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {p.id === activeProfile?.id && <Check className="w-3 h-3 flex-shrink-0" />}
                    <span className="truncate">{p.display_name || p.username || "Sans nom"}</span>
                    {p.username && (
                      <span className="text-[10px] text-muted-foreground ml-auto">/{p.username}</span>
                    )}
                  </button>
                  {profiles.length > 1 && p.id !== activeProfile?.id && (
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/item:opacity-100 transition-all"
                    >
                      {deleting === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              ))}

              {/* Create new */}
              {isPaidPlan && canCreate && !creating && (
                <button
                  onClick={() => setCreating(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-primary hover:bg-primary/5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nouvelle page
                </button>
              )}

              {!isPaidPlan && (
                <div className="flex items-center gap-2 px-3 py-2 text-[10px] text-muted-foreground">
                  <Crown className="w-3 h-3 text-amber-500" />
                  Passe en Starter pour créer plusieurs pages
                </div>
              )}

              {isPaidPlan && !canCreate && (
                <div className="flex items-center gap-2 px-3 py-2 text-[10px] text-muted-foreground">
                  <Crown className="w-3 h-3 text-amber-500" />
                  Limite de {limit} pages atteinte
                </div>
              )}

              {/* Create form */}
              <AnimatePresence>
                {creating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 space-y-2 border border-border/60 rounded-xl mt-1 bg-secondary/30">
                      <Input
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        placeholder="Nom de la page"
                        className="h-8 text-xs rounded-lg"
                      />
                      <Input
                        value={newUsername}
                        onChange={e => setNewUsername(e.target.value)}
                        placeholder="nom-utilisateur (URL)"
                        className="h-8 text-xs rounded-lg"
                      />
                      <div className="flex gap-1.5">
                        <button
                          onClick={handleCreate}
                          disabled={loading}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium gradient-cta text-primary-foreground"
                        >
                          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Créer"}
                        </button>
                        <button
                          onClick={() => { setCreating(false); setNewName(""); setNewUsername(""); }}
                          className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-secondary"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
