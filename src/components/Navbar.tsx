import { Link2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gradient-cta flex items-center justify-center shadow-rose">
            <Link2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-dm font-700 text-xl text-foreground tracking-tight">
            Avy<span className="text-gradient">Link</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Fonctionnalités", "Tarifs", "Démo"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace("é", "e").replace("î", "i")}`}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            Connexion
          </Button>
          <Button size="sm" className="gradient-cta text-primary-foreground shadow-rose hover:shadow-rose-lg transition-shadow rounded-xl font-semibold">
            Commencer Gratuitement
          </Button>
        </div>

        {/* Mobile menu */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden glass border-t border-white/30 px-4 py-4 space-y-3 animate-fade-up">
          {["Fonctionnalités", "Tarifs", "Démo"].map((item) => (
            <a key={item} href="#" className="block text-sm font-medium text-muted-foreground hover:text-primary">
              {item}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Button variant="outline" size="sm">Connexion</Button>
            <Button size="sm" className="gradient-cta text-primary-foreground">Commencer Gratuitement</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
