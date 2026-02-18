import { useState } from "react";
import { ArrowLeft, Save, Loader2, Star, Search, BarChart2, Target, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface Props {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
  onBack: () => void;
}

type ActiveSection = null | "favicon" | "seo" | "analytics" | "pixel" | "utm";

export default function DashboardAdvancedSettings({ profile, onUpdate, onBack }: Props) {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    seo_title: (profile as Record<string, unknown>)?.seo_title as string || "",
    seo_description: (profile as Record<string, unknown>)?.seo_description as string || "",
    google_analytics_id: (profile as Record<string, unknown>)?.google_analytics_id as string || "",
    facebook_pixel_id: (profile as Record<string, unknown>)?.facebook_pixel_id as string || "",
    favicon_url: (profile as Record<string, unknown>)?.favicon_url as string || "",
  });

  const save = async (fields: Partial<typeof form>) => {
    if (!profile) return;
    setSaving(true);
    await onUpdate(fields as Partial<Profile>);
    setSaving(false);
    toast({ title: "✅ Réglages avancés sauvegardés !" });
  };

  const SECTIONS = [
    {
      id: "favicon" as ActiveSection,
      icon: Star,
      title: "Icône de favori",
      desc: "Lorsqu'une personne marque votre page Web ou ajoute votre page Web à son écran d'accueil, cette icône est utilisée.",
    },
    {
      id: "seo" as ActiveSection,
      icon: Search,
      title: "SEO",
      desc: "Améliorez la visibilité de votre site auprès des moteurs de recherche et augmentez le trafic organique en remplissant les champs SEO du site.",
    },
    {
      id: "analytics" as ActiveSection,
      icon: BarChart2,
      title: "Google Analytics",
      desc: "Ajoutez Google Analytics pour exploiter la puissance de GA dans votre trafic AvyLink.",
    },
    {
      id: "pixel" as ActiveSection,
      icon: Target,
      title: "Facebook Pixel",
      desc: "Ajoutez le code pixel à votre site Web pour exécuter des campagnes de conversion, créer des rapports avancés et un reciblage personnalisé.",
    },
    {
      id: "utm" as ActiveSection,
      icon: Link2,
      title: "UTM Parameters",
      desc: "Faites en sorte que Google Analytics affiche le trafic AvyLink en tant que trafic « social ». Le paramètre de campagne est défini dynamiquement à partir du titre de chaque lien.",
    },
  ];

  if (activeSection) {
    const section = SECTIONS.find(s => s.id === activeSection)!;
    const SectionIcon = section.icon;

    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
        <button onClick={() => setActiveSection(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> {section.title}
        </button>

        <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <SectionIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-dm font-bold text-base text-foreground">{section.title}</h3>
              <p className="text-xs text-muted-foreground">{section.desc}</p>
            </div>
          </div>

          {activeSection === "favicon" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">URL de l'icône</label>
                <Input
                  value={form.favicon_url}
                  onChange={e => setForm(f => ({ ...f, favicon_url: e.target.value }))}
                  placeholder="https://..."
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground mt-1">Format recommandé : 32x32 ou 64x64 px (PNG, ICO)</p>
              </div>
              {form.favicon_url && (
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                  <img src={form.favicon_url} alt="Favicon" className="w-8 h-8 rounded object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="text-sm text-foreground">Aperçu de l'icône</span>
                </div>
              )}
              <Button onClick={() => save({ favicon_url: form.favicon_url } as Partial<Profile>)} disabled={saving} className="w-full gradient-cta text-primary-foreground rounded-xl">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Sauvegarder
              </Button>
            </div>
          )}

          {activeSection === "seo" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Titre SEO</label>
                <Input
                  value={form.seo_title}
                  onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))}
                  placeholder="Mon profil - Nom | AvyLink"
                  maxLength={60}
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground mt-1">{form.seo_title.length}/60 caractères</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Description SEO</label>
                <textarea
                  value={form.seo_description}
                  onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))}
                  placeholder="Découvrez mon profil AvyLink avec tous mes liens..."
                  maxLength={160}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-xs text-muted-foreground mt-1">{form.seo_description.length}/160 caractères</p>
              </div>
              {/* Preview */}
              {(form.seo_title || form.seo_description) && (
                <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Aperçu Google</p>
                  <p className="text-primary text-sm font-medium">{form.seo_title || "Titre de votre page"}</p>
                  <p className="text-success text-xs">avylink.app/u/{profile?.username || "..."}</p>
                  <p className="text-muted-foreground text-xs mt-1">{form.seo_description || "Description de votre page..."}</p>
                </div>
              )}
              <Button onClick={() => save({ seo_title: form.seo_title, seo_description: form.seo_description } as Partial<Profile>)} disabled={saving} className="w-full gradient-cta text-primary-foreground rounded-xl">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Sauvegarder
              </Button>
            </div>
          )}

          {activeSection === "analytics" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">ID de mesure Google Analytics</label>
                <Input
                  value={form.google_analytics_id}
                  onChange={e => setForm(f => ({ ...f, google_analytics_id: e.target.value }))}
                  placeholder="G-XXXXXXXXXX ou UA-XXXXXXXX"
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground mt-1">Trouvez votre ID dans Google Analytics → Admin → Flux de données</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/15">
                <p className="text-xs text-primary font-medium mb-1">💡 Comment faire ?</p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-4">
                  <li>Allez sur analytics.google.com</li>
                  <li>Admin → Propriété → Flux de données</li>
                  <li>Copiez l'ID de mesure (G-...)</li>
                  <li>Collez-le ici et sauvegardez</li>
                </ol>
              </div>
              <Button onClick={() => save({ google_analytics_id: form.google_analytics_id } as Partial<Profile>)} disabled={saving} className="w-full gradient-cta text-primary-foreground rounded-xl">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Sauvegarder
              </Button>
            </div>
          )}

          {activeSection === "pixel" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">ID du pixel Facebook</label>
                <Input
                  value={form.facebook_pixel_id}
                  onChange={e => setForm(f => ({ ...f, facebook_pixel_id: e.target.value }))}
                  placeholder="123456789012345"
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground mt-1">Trouvez votre ID dans Facebook Events Manager</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/15">
                <p className="text-xs text-primary font-medium mb-1">💡 Comment faire ?</p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-4">
                  <li>Allez sur business.facebook.com</li>
                  <li>Events Manager → Pixels</li>
                  <li>Copiez l'ID de votre pixel</li>
                  <li>Collez-le ici et sauvegardez</li>
                </ol>
              </div>
              <Button onClick={() => save({ facebook_pixel_id: form.facebook_pixel_id } as Partial<Profile>)} disabled={saving} className="w-full gradient-cta text-primary-foreground rounded-xl">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Sauvegarder
              </Button>
            </div>
          )}

          {activeSection === "utm" && (
            <div className="space-y-4">
              <div className="p-4 bg-success/10 rounded-xl border border-success/20">
                <p className="text-sm font-medium text-success mb-2">✅ Paramètres UTM actifs</p>
                <p className="text-xs text-muted-foreground">Les paramètres UTM sont automatiquement ajoutés à tous vos liens pour suivre le trafic dans Google Analytics.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">utm_source</span>
                  <span className="text-sm font-medium text-foreground">avylink</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">utm_medium</span>
                  <span className="text-sm font-medium text-foreground">social</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">utm_campaign</span>
                  <span className="text-sm font-medium text-foreground">[titre du lien]</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Le paramètre de campagne est défini dynamiquement à partir du titre de chaque lien.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux paramètres
      </button>

      <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-dm font-bold text-base text-foreground">Réglages avancés</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Configuration SEO, Analytics et tracking</p>
        </div>
        {SECTIONS.map(section => {
          const SectionIcon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="w-full flex items-start gap-4 px-5 py-4 hover:bg-secondary/60 transition-colors border-b border-border/50 last:border-0 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <SectionIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{section.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{section.desc}</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-muted-foreground flex-shrink-0 rotate-180 mt-1" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
