import { Instagram, Twitter, Youtube, Facebook, Mail } from "lucide-react";
import avylinkLogo from "@/assets/avylink-logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={avylinkLogo}
                alt="AvyLink Logo"
                className="w-9 h-9 rounded-xl object-cover"
              />
              <span className="font-dm font-bold text-xl text-white">
                Avy<span className="text-primary-light">Link</span>
              </span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              La plateforme de portfolio personnalisable
              conçue pour les créateurs africains et du monde entier.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 glass rounded-lg flex items-center justify-center text-background/60 hover:text-primary transition-colors"
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
              links: ["Documentation", "Blog", "Tutoriels vidéo", "API", "Statut système"],
            },
            {
              title: "Entreprise",
              links: ["À propos", "Contact", "Partenaires", "Mentions légales", "Politique de confidentialité"],
            },
          ].map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="font-dm font-bold text-white text-sm uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-background/60 hover:text-primary text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass-blue rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h4 className="font-dm font-bold text-white mb-1">Reste informé 💌</h4>
            <p className="text-background/60 text-sm">Nouveautés, astuces et offres exclusives directement dans ta boîte mail.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="ton@email.com"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-background/40 text-sm focus:outline-none focus:border-primary flex-1 sm:w-56"
            />
            <button className="gradient-cta text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
              <Mail className="w-4 h-4" />
              S'abonner
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-background/40 text-sm">
            © 2026 AvyLink — Fait avec 🌸 en Afrique
          </p>
          <div className="flex items-center gap-4 text-background/40 text-xs">
            <span>🇫🇷 Français</span>
            <span>•</span>
            <span>🇬🇧 English</span>
            <span>•</span>
            <span>🌍 Multi-langues</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
