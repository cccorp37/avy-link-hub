import {
  Instagram, Youtube, Twitter, Music, ShoppingBag, Globe,
  Heart, ExternalLink, Play, MapPin
} from "lucide-react";

const profileLinks = [
  { icon: Instagram, label: "Instagram", handle: "@kofi.creates", color: "bg-gradient-to-br from-purple-500 to-pink-500", url: "#" },
  { icon: Youtube, label: "YouTube", handle: "Kofi Creates TV", color: "bg-red-500", url: "#" },
  { icon: Twitter, label: "Twitter / X", handle: "@kofi_creates", color: "bg-sky-500", url: "#" },
  { icon: Music, label: "Spotify", handle: "Écouter ma musique", color: "bg-green-500", url: "#" },
  { icon: ShoppingBag, label: "Ma Boutique", handle: "shop.kofi.avylink.com", color: "bg-gradient-cta", url: "#" },
  { icon: Globe, label: "Mon Portfolio", handle: "kofi.design", color: "bg-primary", url: "#" },
];

const ProfileDemo = () => {
  return (
    <section id="demo" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-dm font-bold text-4xl md:text-5xl text-foreground tracking-tight">
            Voilà à quoi ressemble
            <br />
            <span className="text-gradient">ta page AVYLINK</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple, beau, professionnel. En moins de 5 minutes.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 justify-center">
          {/* Phone mockup */}
          <div className="relative">
            {/* Phone frame */}
            <div className="w-80 bg-foreground rounded-[3rem] p-3 shadow-2xl">
              <div className="w-full bg-white rounded-[2.4rem] overflow-hidden" style={{ minHeight: 640 }}>
                {/* Status bar */}
                <div className="bg-primary/5 px-6 pt-4 pb-2 flex justify-between items-center text-xs text-muted-foreground">
                  <span>9:41</span>
                  <div className="w-24 h-1 bg-foreground/20 rounded-full" />
                  <span>●●●</span>
                </div>

                {/* Profile content */}
                <div className="gradient-soft min-h-full px-5 pb-8 pt-4 space-y-5">
                  {/* Avatar */}
                  <div className="text-center space-y-2">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-3xl mx-auto shadow-rose">
                        👨🏿‍💻
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-dm font-bold text-base text-foreground">Kofi Asante</h3>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3" /> Accra, Ghana 🇬🇭
                      </p>
                      <p className="text-xs text-foreground/70 mt-1 max-w-48 mx-auto">
                        🎨 Designer & Créateur de contenu · Je partage ma passion
                      </p>
                    </div>
                    <div className="flex justify-center gap-3 text-xs">
                      <span className="glass-pink text-primary px-2 py-0.5 rounded-full font-semibold">✓ Certified</span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Heart className="w-3 h-3 text-primary" /> 24.5K fans
                      </span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="space-y-2.5">
                    {profileLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <div
                          key={link.label}
                          className="flex items-center gap-3 bg-white rounded-2xl px-3 py-2.5 shadow-card cursor-pointer hover:shadow-card-hover transition-all hover:-translate-y-0.5 group"
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${link.color}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-xs text-foreground">{link.label}</div>
                            <div className="text-xs text-muted-foreground truncate">{link.handle}</div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      );
                    })}
                  </div>

                  {/* YouTube thumbnail */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-card">
                    <div className="relative bg-foreground/10 h-20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="px-3 py-2">
                      <p className="text-xs font-semibold text-foreground">Comment j'ai gagné 1M FCFA en 30 jours</p>
                      <p className="text-xs text-muted-foreground">142K vues · il y a 3 jours</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Powered by <span className="text-gradient font-semibold">AvyLink</span> 🌸
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-6 top-16 glass rounded-2xl px-3 py-2 shadow-card animate-float text-center">
              <div className="text-lg">🔥</div>
              <div className="text-xs font-bold text-foreground">Viral!</div>
              <div className="text-xs text-muted-foreground">+4.2K/j</div>
            </div>
            <div className="absolute -left-6 bottom-20 glass rounded-2xl px-3 py-2 shadow-card animate-float-delayed text-center">
              <div className="text-lg">💰</div>
              <div className="text-xs font-bold text-foreground">Revenus</div>
              <div className="text-xs text-muted-foreground">340K FCFA</div>
            </div>
          </div>

          {/* Right side info */}
          <div className="max-w-md space-y-8">
            <div>
              <h3 className="font-dm font-bold text-2xl text-foreground mb-2">
                Crée ta page en <span className="text-gradient">5 minutes</span>
              </h3>
              <p className="text-muted-foreground">
                Pas besoin de coder. Notre éditeur drag-and-drop te permet de tout personnaliser.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { step: "1", title: "Crée ton compte gratuitement", desc: "Email, Google ou téléphone — c'est toi qui choisis" },
                { step: "2", title: "Personnalise ta page", desc: "Ajoute tes liens, choisis ton thème, upload ta photo" },
                { step: "3", title: "Partage ton lien unique", desc: "avylink.com/tonnom — mets-le partout !" },
                { step: "4", title: "Suis tes performances", desc: "Analytics en temps réel, sources de trafic, clics" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-10 h-10 gradient-cta text-primary-foreground rounded-xl flex items-center justify-center font-dm font-bold text-sm flex-shrink-0 shadow-rose">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-pink rounded-2xl p-5">
              <p className="text-primary font-semibold text-sm mb-1">💡 Le saviez-vous ?</p>
              <p className="text-foreground/80 text-sm">
                Les créateurs AvyLink génèrent en moyenne <strong>3x plus de clics</strong> qu'avec Linktree, 
                grâce à nos pages optimisées pour le marché africain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileDemo;
