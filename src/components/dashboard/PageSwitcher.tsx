import { useState } from "react";
import { Plus, ChevronDown, FileText, Check, Crown, Trash2, Loader2, Copy, Sparkles } from "lucide-react";
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
  business: 999,
};

const PLAN_LABELS: Record<string, string> = {
  free: "Gratuit",
  starter: "Starter",
  premium: "Premium",
  business: "Business",
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
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const { toast } = useToast();

  const currentPlan = activeProfile?.plan || "free";
  const limit = PLAN_LIMITS[currentPlan] || 1;
  const canCreate = profiles.length < limit;
  const isPaidPlan = currentPlan !== "free";

  const checkUsername = async (slug: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", slug)
      .maybeSingle();
    return !data;
  };

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
    const free = await checkUsername(slug);
    if (!free) {
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
        plan: currentPlan,
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
      toast({ title: "Nouvelle page créée ✨" });
    }
    setLoading(false);
  };

  const handleDuplicate = async (source: Profile) => {
    if (!canCreate) {
      toast({ title: `Limite de ${limit} pages atteinte`, variant: "destructive" });
      return;
    }
    setDuplicating(source.id);

    // Find unique username
    const base = (source.username || "page").replace(/-copy-\d+$/, "");
    let candidate = `${base}-copy`;
    let i = 1;
    while (!(await checkUsername(candidate))) {
      i += 1;
      candidate = `${base}-copy-${i}`;
      if (i > 50) break;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setDuplicating(null); return; }

    // Clone profile (omit identifiers + computed fields)
    const { id: _id, created_at: _c, updated_at: _u, username: _un, is_verified: _v, custom_domain: _cd, ...clone } = source as any;
    const { data: newProfile, error } = await supabase
      .from("profiles")
      .insert({
        ...clone,
        user_id: user.id,
        username: candidate,
        display_name: `${source.display_name || "Ma page"} (copie)`,
        is_verified: false,
        custom_domain: null,
      })
      .select()
      .single();

    if (error || !newProfile) {
      toast({ title: "Erreur de duplication", description: error?.message, variant: "destructive" });
      setDuplicating(null);
      return;
    }

    // Clone blocks
    const { data: blocks } = await supabase
      .from("page_blocks")
      .select("type,title,content,position,is_active")
      .eq("profile_id", source.id);
    if (blocks?.length) {
      await supabase.from("page_blocks").insert(
        blocks.map(b => ({ ...b, profile_id: newProfile.id }))
      );
    }

    // Clone links
    const { data: links } = await supabase
      .from("profile_links")
      .select("title,url,icon,position,is_active")
      .eq("profile_id", source.id);
    if (links?.length) {
      await supabase.from("profile_links").insert(
        links.map(l => ({ ...l, profile_id: newProfile.id }))
      );
    }

    onCreated(newProfile);
    toast({ title: "Page dupliquée ✨", description: `Nouvelle page : /${candidate}` });
    setDuplicating(null);
  };

  const handleDelete = async (profileId: string) => {
    if (profiles.length <= 1) {
      toast({ title: "Tu ne peux pas supprimer ta seule page", variant: "destructive" });
      return;
    }
    setDeleting(profileId);
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
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mx-auto hover:scale-105 transition"
        title="Mes pages"
      >
        <FileText className="w-4 h-4 text-primary" />
      </button>
    );
  }

  const planLabel = PLAN_LABELS[currentPlan] || "Gratuit";

  return (
    <div className="px-3 py-2">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/10">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate flex items-center gap-1.5">
            {activeProfile?.display_name || "Ma page"}
          </p>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-secondary/70 font-medium">
              {planLabel}
            </span>
            <span>·</span>
            <span>{profiles.length}/{limit === 999 ? "∞" : limit} pages</span>
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
            <div className="mt-2 space-y-2 py-1">
              {/* Pages list */}
              <div className="space-y-0.5 rounded-xl border border-border/40 bg-secondary/20 p-1.5">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Mes pages
                </p>
                {profiles.map((p) => {
                  const isActive = p.id === activeProfile?.id;
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center gap-1 group/item rounded-lg transition-all ${
                        isActive ? "bg-primary/10" : "hover:bg-secondary/80"
                      }`}
                    >
                      <button
                        onClick={() => { onSwitch(p); setOpen(false); }}
                        className="flex-1 flex items-center gap-2 px-2.5 py-2 text-xs text-left min-w-0"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-primary" : "bg-muted-foreground/30"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`truncate font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                            {p.display_name || "Sans nom"}
                          </p>
                          {p.username && (
                            <p className="text-[10px] text-muted-foreground truncate">/{p.username}</p>
                          )}
                        </div>
                        {isActive && <Check className="w-3 h-3 text-primary flex-shrink-0" />}
                      </button>

                      {/* Actions */}
                      <div className="flex items-center pr-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        {isPaidPlan && canCreate && (
                          <button
                            onClick={() => handleDuplicate(p)}
                            disabled={duplicating === p.id}
                            title="Dupliquer cette page"
                            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10"
                          >
                            {duplicating === p.id
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                        {profiles.length > 1 && !isActive && (
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deleting === p.id}
                            title="Supprimer"
                            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            {deleting === p.id
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <Trash2 className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Create CTA */}
              {isPaidPlan && canCreate && !creating && (
                <button
                  onClick={() => setCreating(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-primary border border-dashed border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Créer une nouvelle page
                </button>
              )}

              {!isPaidPlan && (
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-foreground">Mode multipage</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">
                      Passe en Starter (3 pages) ou Premium (illimité) pour créer plusieurs portfolios.
                    </p>
                  </div>
                </div>
              )}

              {isPaidPlan && !canCreate && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/50 border border-border/40">
                  <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    Limite de <b>{limit} pages</b> atteinte sur ton plan {planLabel}.
                  </p>
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
                    <div className="p-3 space-y-2 border border-primary/20 rounded-xl bg-primary/5">
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
                          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Créer la page"}
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
