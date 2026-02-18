import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SocialIcon, { getPlatformColor, getPlatformLabel, PLATFORM_COLORS } from "@/components/SocialIcon";
import avylinkLogo from "@/assets/avylink-logo.jpg";
import type { Tables } from "@/integrations/supabase/types";

type ProfileLink = Tables<"profile_links">;
type Profile = Tables<"profiles">;

// Extract YouTube video ID
function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Extract Spotify data
function extractSpotifyData(url: string): { type: string; id: string } | null {
  const match = url.match(/spotify\.com\/(track|album|playlist|episode)\/([A-Za-z0-9]+)/);
  return match ? { type: match[1], id: match[2] } : null;
}

// Extract TikTok video ID
function extractTikTokId(url: string): string | null {
  const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  return match ? match[1] : null;
}

// Determine display type from link
function getLinkDisplayType(link: ProfileLink): string {
  const platform = link.icon || "website";
  if (platform === "youtube" || extractYouTubeId(link.url)) return "youtube";
  if (platform === "spotify" || link.url.includes("spotify.com")) return "spotify";
  if (platform === "tiktok" || link.url.includes("tiktok.com")) return "tiktok";
  return "standard";
}

// ─── Link Block Components ────────────────────────────────────────────────────

function YouTubeBlock({ link }: { link: ProfileLink }) {
  const videoId = extractYouTubeId(link.url);
  const [expanded, setExpanded] = useState(false);

  if (!videoId) return <StandardLinkBlock link={link} />;

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-border/50 bg-card">
      {expanded ? (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title={link.title}
          />
        </div>
      ) : (
        <button
          className="relative w-full aspect-video group cursor-pointer block"
          onClick={() => setExpanded(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={link.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-[12px] border-b-[12px] border-l-[20px] border-t-transparent border-b-transparent border-l-white ml-1.5" />
            </div>
          </div>
          {/* YouTube badge */}
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <span>▶</span> YouTube
          </div>
        </button>
      )}
      <div className="p-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{link.title}</p>
          <p className="text-xs text-muted-foreground">{link.click_count} vues</p>
        </div>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
          onClick={() => incrementClick(link.id)}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

function SpotifyBlock({ link }: { link: ProfileLink }) {
  const spotifyData = extractSpotifyData(link.url);
  if (!spotifyData) return <StandardLinkBlock link={link} />;

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-border/50 bg-card">
      <iframe
        src={`https://open.spotify.com/embed/${spotifyData.type}/${spotifyData.id}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="block"
        title={link.title}
      />
      <div className="px-3 pb-3 pt-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SocialIcon platform="spotify" size={20} />
          <p className="text-sm font-semibold text-foreground">{link.title}</p>
        </div>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
          onClick={() => incrementClick(link.id)}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function TikTokBlock({ link }: { link: ProfileLink }) {
  const videoId = extractTikTokId(link.url);
  if (!videoId) return <StandardLinkBlock link={link} />;

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-border/50 bg-card">
      <div className="flex justify-center bg-black/5 py-2">
        <iframe
          src={`https://www.tiktok.com/embed/v2/${videoId}`}
          className="w-full max-w-sm"
          height="580"
          allow="encrypted-media"
          loading="lazy"
          title={link.title}
        />
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SocialIcon platform="tiktok" size={20} />
          <p className="text-sm font-semibold text-foreground">{link.title}</p>
        </div>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
          onClick={() => incrementClick(link.id)}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function StandardLinkBlock({ link }: { link: ProfileLink }) {
  const platform = link.icon || "website";
  const color = getPlatformColor(platform);
  const label = getPlatformLabel(platform);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => incrementClick(link.id)}
      className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}18` }}
      >
        <SocialIcon platform={platform} size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {link.title}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0" />
    </a>
  );
}


async function incrementClick(linkId: string) {
  // Increment click count via select+update pattern
  try {
    const { data } = await supabase
      .from("profile_links")
      .select("click_count")
      .eq("id", linkId)
      .single();
    if (data) {
      await supabase
        .from("profile_links")
        .update({ click_count: (data.click_count || 0) + 1 })
        .eq("id", linkId);
    }
  } catch (_) { /* silent fail */ }
}

// ─── Social Icons Block ────────────────────────────────────────────────────────

function SocialIconsBlock({ content }: { content: Record<string, unknown> }) {
  const networks = ["facebook","instagram","twitter","tiktok","youtube","linkedin","whatsapp","snapchat","discord","telegram","pinterest","github"];
  const filled = networks.filter(n => content[n]);
  if (filled.length === 0) return null;
  return (
    <div className="flex flex-wrap justify-center gap-3 py-2">
      {filled.map(n => (
        <a
          key={n}
          href={content[n] as string}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
          style={{ backgroundColor: `${(PLATFORM_COLORS as Record<string,string>)[n] || "#999"}18` }}
        >
          <SocialIcon platform={n} size={22} />
        </a>
      ))}
    </div>
  );
}

// ─── Page Block Renderer ────────────────────────────────────────────────────────

function PageBlockRenderer({ block }: { block: { type: string; title: string | null; content: Record<string, unknown>; is_active: boolean } }) {
  if (!block.is_active) return null;
  const c = block.content;

  if (block.type === "heading") {
    return (
      <div className="text-center py-2">
        {c.text && <p className="font-dm font-bold text-xl text-foreground">{c.text as string}</p>}
        {c.subtitle && <p className="text-sm text-muted-foreground mt-1">{c.subtitle as string}</p>}
      </div>
    );
  }

  if (block.type === "social_icons") {
    return <SocialIconsBlock content={c} />;
  }

  if (block.type === "divider") {
    const style = (c.style as string) || "solid";
    return (
      <div className={`my-1 border-t border-border/40 ${style === "dashed" ? "border-dashed" : style === "dotted" ? "border-dotted" : ""}`} />
    );
  }

  if (block.type === "text") {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-4">
        {block.title && <p className="font-dm font-semibold text-sm text-foreground mb-2">{block.title}</p>}
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{c.text as string}</p>
      </div>
    );
  }

  if (block.type === "form") {
    return <PublicFormBlock block={block} />;
  }

  return null;
}

function PublicFormBlock({ block }: { block: { type: string; title: string | null; content: Record<string, unknown>; is_active: boolean } & { profile_id?: string } }) {
  const [form, setForm] = useState({ full_name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const c = block.content;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await supabase.from("form_submissions").insert({
        profile_id: (block as Record<string, unknown>).profile_id as string,
        ...form,
      });
      setSubmitted(true);
    } catch { /* silent */ }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-5 text-center">
        <span className="text-3xl">✅</span>
        <p className="font-semibold text-foreground mt-2">{(c.successMessage as string) || "Merci pour votre message !"}</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5">
      <p className="font-dm font-semibold text-base text-foreground mb-4">{(c.formTitle as string) || block.title || "Contactez-moi"}</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          required
          placeholder="Nom complet"
          value={form.full_name}
          onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <textarea
          rows={3}
          placeholder="Message"
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 gradient-cta text-primary-foreground rounded-xl font-semibold text-sm transition-opacity disabled:opacity-70"
        >
          {submitting ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
}

// ─── Main Profile Page ────────────────────────────────────────────────────────

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [blocks, setBlocks] = useState<Array<{ id: string; type: string; title: string | null; content: Record<string, unknown>; position: number; is_active: boolean; profile_id: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;
    const loadProfile = async () => {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (error || !profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      const [linksResult, blocksResult] = await Promise.all([
        supabase.from("profile_links").select("*").eq("profile_id", profileData.id).eq("is_active", true).order("position", { ascending: true }),
        supabase.from("page_blocks").select("*").eq("profile_id", profileData.id).eq("is_active", true).order("position", { ascending: true }),
      ]);

      setLinks(linksResult.data || []);
      setBlocks((blocksResult.data || []).map(b => ({ ...b, profile_id: profileData.id, content: (b.content as Record<string, unknown>) || {} })));
      setLoading(false);
    };

    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
          <h1 className="font-dm font-bold text-2xl text-foreground">Profil introuvable</h1>
          <p className="text-muted-foreground">
            Le profil <strong>@{username}</strong> n'existe pas ou a été supprimé.
          </p>
          <a href="/" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
            ← Retour à AvyLink
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="max-w-lg mx-auto px-4 py-10">
        {/* Profile header */}
        <div className="text-center mb-8">
          {/* Avatar */}
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name || ""} className="w-20 h-20 mx-auto mb-4 rounded-full object-cover shadow-blue" />
          ) : (
            <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center shadow-blue text-3xl font-bold text-primary-foreground">
              {profile.display_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || "?"}
            </div>
          )}

          <h1 className="font-dm font-bold text-2xl text-foreground mb-1">
            {profile.display_name || `@${profile.username}`}
          </h1>
          {profile.username && (
            <p className="text-sm text-muted-foreground mb-2">@{profile.username}</p>
          )}
          {profile.bio && (
            <p className="text-sm text-foreground/70 max-w-xs mx-auto leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Page blocks (social icons, headings, forms, text...) */}
        {blocks.length > 0 && (
          <div className="space-y-3 mb-4">
            {blocks.map(block => (
              <PageBlockRenderer key={block.id} block={block} />
            ))}
          </div>
        )}

        {/* Links */}
        {links.length === 0 && blocks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucun lien pour l'instant.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => {
              const displayType = getLinkDisplayType(link);
              if (displayType === "youtube") return <YouTubeBlock key={link.id} link={link} />;
              if (displayType === "spotify") return <SpotifyBlock key={link.id} link={link} />;
              if (displayType === "tiktok") return <TikTokBlock key={link.id} link={link} />;
              return <StandardLinkBlock key={link.id} link={link} />;
            })}
          </div>
        )}

        {/* Footer branding */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Créé avec
            <img src={avylinkLogo} alt="AvyLink" className="w-4 h-4 rounded object-cover" />
            <span className="font-dm font-bold">AvyLink</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;

