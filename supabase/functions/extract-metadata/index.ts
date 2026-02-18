const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Extract Spotify track/album/playlist ID
function extractSpotifyId(url: string): { type: string; id: string } | null {
  const match = url.match(/spotify\.com\/(track|album|playlist|episode)\/([A-Za-z0-9]+)/);
  if (match) return { type: match[1], id: match[2] };
  return null;
}

// Extract TikTok video ID
function extractTikTokId(url: string): string | null {
  const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  return match ? match[1] : null;
}

// Detect platform from URL
function detectPlatform(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('spotify.com')) return 'spotify';
  if (lower.includes('tiktok.com')) return 'tiktok';
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
  if (lower.includes('linkedin.com')) return 'linkedin';
  if (lower.includes('soundcloud.com')) return 'soundcloud';
  if (lower.includes('vimeo.com')) return 'vimeo';
  if (lower.includes('twitch.tv')) return 'twitch';
  return 'website';
}

// Parse meta tags from HTML
function parseMetaTags(html: string, baseUrl: string) {
  const getMetaContent = (patterns: RegExp[]): string => {
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) return decodeHTMLEntities(match[1].trim());
    }
    return '';
  };

  const decodeHTMLEntities = (text: string): string => {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#(\d+);/g, (_match, num) => String.fromCharCode(parseInt(num)));
  };

  const title = getMetaContent([
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
    /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:title["']/i,
    /<title[^>]*>([^<]+)<\/title>/i,
  ]);

  const description = getMetaContent([
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i,
    /<meta[^>]+name=["']twitter:description["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:description["']/i,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
  ]);

  let image = getMetaContent([
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ]);

  // Make relative URLs absolute
  if (image && !image.startsWith('http')) {
    try {
      const base = new URL(baseUrl);
      image = new URL(image, base.origin).href;
    } catch (_) { /* ignore */ }
  }

  const type = getMetaContent([
    /<meta[^>]+property=["']og:type["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:type["']/i,
  ]);

  const siteName = getMetaContent([
    /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i,
  ]);

  let favicon = getMetaContent([
    /<link[^>]+rel=["']icon["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']icon["']/i,
    /<link[^>]+rel=["']shortcut icon["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']shortcut icon["']/i,
    /<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i,
  ]);

  if (favicon && !favicon.startsWith('http')) {
    try {
      const base = new URL(baseUrl);
      favicon = new URL(favicon, base.origin).href;
    } catch (_) {
      try {
        favicon = new URL(baseUrl).origin + '/favicon.ico';
      } catch (_) { /* ignore */ }
    }
  }
  if (!favicon) {
    try {
      favicon = new URL(baseUrl).origin + '/favicon.ico';
    } catch (_) { /* ignore */ }
  }

  return { title, description, image, type, siteName, favicon };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'URL invalide ou manquante' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate & normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(normalizedUrl);
    } catch (_) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL malformée' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const platform = detectPlatform(normalizedUrl);

    // Platform-specific handling without scraping
    const youtubeId = extractYouTubeId(normalizedUrl);
    const spotifyData = extractSpotifyId(normalizedUrl);
    const tiktokId = extractTikTokId(normalizedUrl);

    // Fetch the HTML page
    let html = '';
    let fetchSuccess = false;

    try {
      const response = await fetch(normalizedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AvyLinkBot/1.0; +https://avylink.app/bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        signal: AbortSignal.timeout(10000),
        redirect: 'follow',
      });

      if (response.ok) {
        html = await response.text();
        fetchSuccess = true;
      }
    } catch (err) {
      console.warn('Fetch failed:', err);
    }

    // Parse metadata from HTML
    const meta = fetchSuccess ? parseMetaTags(html, normalizedUrl) : {
      title: '', description: '', image: '', type: '', siteName: '', favicon: ''
    };

    // Build platform-specific embed data
    const embedData: Record<string, unknown> = {};

    if (platform === 'youtube' && youtubeId) {
      embedData.videoId = youtubeId;
      embedData.embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
      embedData.thumbnailUrl = meta.image || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
      if (!meta.title) meta.title = 'Vidéo YouTube';
      if (!meta.siteName) meta.siteName = 'YouTube';
    }

    if (platform === 'spotify' && spotifyData) {
      embedData.spotifyType = spotifyData.type;
      embedData.spotifyId = spotifyData.id;
      embedData.embedUrl = `https://open.spotify.com/embed/${spotifyData.type}/${spotifyData.id}`;
      if (!meta.siteName) meta.siteName = 'Spotify';
    }

    if (platform === 'tiktok' && tiktokId) {
      embedData.videoId = tiktokId;
      embedData.embedUrl = `https://www.tiktok.com/embed/v2/${tiktokId}`;
      if (!meta.siteName) meta.siteName = 'TikTok';
    }

    // Normalize og:type
    let contentType = 'website';
    if (meta.type) {
      if (meta.type.includes('video')) contentType = 'video';
      else if (meta.type.includes('music') || meta.type.includes('song')) contentType = 'music';
      else if (meta.type.includes('article') || meta.type.includes('blog')) contentType = 'article';
      else if (meta.type.includes('product')) contentType = 'product';
    }
    if (platform === 'youtube') contentType = 'video';
    if (platform === 'spotify') contentType = 'music';

    const result = {
      success: true,
      url: normalizedUrl,
      platform,
      contentType,
      title: meta.title || parsedUrl.hostname,
      description: meta.description || '',
      image: meta.image || '',
      siteName: meta.siteName || parsedUrl.hostname,
      favicon: meta.favicon || '',
      embed: embedData,
    };

    console.log('Extracted metadata for:', normalizedUrl, '→ platform:', platform);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erreur serveur lors de l\'extraction' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
