import { useState, useEffect } from "react";
import { Package, Plus, Trash2, Loader2, Edit2, Check, Eye, EyeOff, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface Props { profile: Profile | null; }

interface StoreItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  is_active: boolean;
  stock: number | null;
  category: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function DashboardStore({ profile }: Props) {
  const { toast } = useToast();
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", image_url: "", stock: "", category: "",
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from("store_items")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data as StoreItem[]) || []);
        setLoading(false);
      });
  }, [profile]);

  const handleAdd = async () => {
    if (!profile || !form.name || !form.price) return;
    setSaving(true);
    const { data, error } = await supabase.from("store_items").insert({
      profile_id: profile.id,
      name: form.name,
      description: form.description || null,
      price: parseInt(form.price),
      image_url: form.image_url || null,
      stock: form.stock ? parseInt(form.stock) : null,
      category: form.category || null,
    }).select().single();

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else if (data) {
      setItems(prev => [data as StoreItem, ...prev]);
      setAddOpen(false);
      setForm({ name: "", description: "", price: "", image_url: "", stock: "", category: "" });
      toast({ title: "✅ Article ajouté !" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await supabase.from("store_items").delete().eq("id", id);
    setItems(prev => prev.filter(i => i.id !== id));
    setDeletingId(null);
    toast({ title: "Article supprimé" });
  };

  const handleToggle = async (item: StoreItem) => {
    const updated = !item.is_active;
    await supabase.from("store_items").update({ is_active: updated }).eq("id", item.id);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: updated } : i));
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="font-dm font-bold text-xl text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Ma Boutique
          </h2>
          <p className="text-sm text-muted-foreground">Vendez directement depuis votre page</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gradient-cta text-primary-foreground rounded-xl">
          <Plus className="w-4 h-4 mr-1" /> Ajouter
        </Button>
      </motion.div>

      {/* Items list */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="rounded-2xl border border-border/40 shadow-card p-5"
        style={{ background: "hsl(var(--card))" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border/40 rounded-2xl">
            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">Aucun article</p>
            <p className="text-xs text-muted-foreground mt-1">Ajoutez votre premier article en vente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  className={`rounded-xl border p-4 transition-all ${
                    item.is_active ? "border-border/40 bg-secondary/20" : "border-border/20 opacity-50"
                  }`}
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  <h4 className="font-dm font-bold text-sm text-foreground truncate">{item.name}</h4>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-primary">
                      {item.price.toLocaleString("fr-FR")} {item.currency}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggle(item)}
                        className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                        title={item.is_active ? "Désactiver" : "Activer"}
                      >
                        {item.is_active ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {item.stock !== null && (
                    <p className="text-[11px] text-muted-foreground mt-1">Stock : {item.stock}</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Add item dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-dm">Nouvel article</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Nom *</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="T-shirt Premium" className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Description de l'article..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Prix (XAF) *</label>
                <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="5000" className="rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium">Stock</label>
                <Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="Illimité" className="rounded-xl" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium">Catégorie</label>
              <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Vêtements, Digital, etc." className="rounded-xl" />
            </div>
            <Button onClick={handleAdd} disabled={saving || !form.name || !form.price} className="w-full gradient-cta text-primary-foreground rounded-xl">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Ajouter l'article
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
