import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, User, LayoutTemplate, Plug, Settings } from "lucide-react";
import { motion } from "framer-motion";

const mobileNav = [
  { to: "/dashboard", label: "Accueil", icon: LayoutDashboard, end: true },
  { to: "/dashboard/page", label: "Ma Page", icon: User },
  { to: "/dashboard/modeles", label: "Modèles", icon: LayoutTemplate },
  { to: "/dashboard/integrations", label: "Intégré", icon: Plug },
  { to: "/dashboard/parametres", label: "Réglages", icon: Settings },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderTop: "1px solid hsl(210 20% 91% / 0.6)",
      }}
    >
      <div className="flex items-stretch">
        {mobileNav.map((item) => {
          const isActive = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-tab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full gradient-cta"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <motion.div
                animate={isActive ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              </motion.div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
