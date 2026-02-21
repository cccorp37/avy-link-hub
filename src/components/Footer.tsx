import { Instagram, Twitter, Youtube, Facebook, Mail, ArrowRight } from "lucide-react";
import avylinkLogo from "@/assets/avylink-logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          {/* Brand — larger presence */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <img
                src={avylinkLogo}
                alt="AvyLink Logo"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="font-dm font-bold text-2xl text-white">
                Avy<span className="text-primary">Link</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              La plateforme de portfolio personnalisable
              conçue pour les créateurs africains et du monde entier.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Youtube, label: "YouTube" },
                { Icon: Facebook, label: "Facebook" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:bg-white/10 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Produit",
              links: ["Fonctionnalités", "Tarifs", "Templates", "Démo live", "Changelog"],
            },
            {
              title: "Ressources",
              links: ["Documentation", "Blog", "Tutoriels vidéo", "API", "Statut"],
            },
            {
              title: "Entreprise",
              links: ["À propos", "Contact", "Partenaires", "Mentions légales", "Confidentialité"],
            },
          ].map((col) => (
            <div key={col.title} className="md:col-span-2 space-y-4">
              <h4 className="font-dm font-bold text-white/80 text-xs uppercase tracking-widest">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter — redesigned */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-8 mb-12 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <h4 className="font-dm font-bold text-white text-lg mb-1">Reste informé 💌</h4>
            <p className="text-white/40 text-sm">Nouveautés, astuces et offres exclusives.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="ton@email.com"
              className="bg-white/5 border border-white/15 rounded-xl px-5 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-primary/50 flex-1 sm:w-64 transition-colors"
            />
            <button className="gradient-cta text-white px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 flex-shrink-0">
              <Mail className="w-4 h-4" />
              S'abonner
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-sm">
            © 2026 AvyLink — Fait avec 💙 en Afrique
          </p>
          <div className="flex items-center gap-4 text-white/30 text-xs">
            <span>🇫🇷 Français</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>🇬🇧 English</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>🌍 Multi-langues</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
