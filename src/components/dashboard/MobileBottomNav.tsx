import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Link2, Palette, BarChart3, Settings } from "lucide-react";

const mobileNav = [
  { to: "/dashboard", label: "Accueil", icon: LayoutDashboard, end: true },
  { to: "/dashboard/liens", label: "Liens", icon: Link2 },
  { to: "/dashboard/apparence", label: "Style", icon: Palette },
  { to: "/dashboard/analytics", label: "Stats", icon: BarChart3 },
  { to: "/dashboard/parametres", label: "Réglages", icon: Settings },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-inset-bottom">
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
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
