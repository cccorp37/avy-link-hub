import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getPlatformIcon, getPlatformColor, getPlatformLabel } from "@/lib/metadata";
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
          <span className="text-lg">🎵</span>
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
          <span className="text-lg">🎬</span>
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
  const icon = getPlatformIcon(platform);
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
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
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

// ─── Main Profile Page ────────────────────────────────────────────────────────

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<ProfileLink[]>([]);
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

      const { data: linksData } = await supabase
        .from("profile_links")
        .select("*")
        .eq("profile_id", profileData.id)
        .eq("is_active", true)
        .order("position", { ascending: true });

      setLinks(linksData || []);
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
          <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center shadow-blue text-3xl font-bold text-primary-foreground">
            {profile.display_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || "?"}
          </div>

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

        {/* Links */}
        {links.length === 0 ? (
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
