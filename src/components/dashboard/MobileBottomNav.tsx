import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, User, LayoutTemplate, Plug, Settings, ChevronUp, Check, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const mobileNav = [
  { to: "/dashboard", label: "Accueil", icon: LayoutDashboard, end: true },
  { to: "/dashboard/page", label: "Ma Page", icon: User },
  { to: "/dashboard/modeles", label: "Modèles", icon: LayoutTemplate },
  { to: "/dashboard/integrations", label: "Intégré", icon: Plug },
  { to: "/dashboard/parametres", label: "Réglages", icon: Settings },
];

interface Props {
  profiles: Profile[];
  activeProfile: Profile | null;
  onSwitchProfile: (profile: Profile) => void;
  onProfileCreated: (profile: Profile) => void;
  onProfileDeleted: (profileId: string) => void;
}

export function MobileBottomNav({ profiles, activeProfile, onSwitchProfile }: Props) {
  const location = useLocation();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const hasMultipleProfiles = profiles.length > 1;

  return (
    <>
      {/* Page switcher overlay */}
      <AnimatePresence>
        {showSwitcher && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[55] bg-black/30 backdrop-blur-sm"
              onClick={() => setShowSwitcher(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              className="md:hidden fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-3 right-3 z-[56] rounded-2xl border border-border/60 shadow-xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="px-4 py-3 border-b border-border/40">
                <p className="text-xs font-semibold text-foreground">Mes pages</p>
                <p className="text-[10px] text-muted-foreground">{profiles.length} page{profiles.length > 1 ? "s" : ""}</p>
              </div>
              <div className="py-1.5 max-h-48 overflow-y-auto">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { onSwitchProfile(p); setShowSwitcher(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      p.id === activeProfile?.id
                        ? "bg-primary/8 text-primary"
                        : "text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{p.display_name || p.username || "Sans nom"}</p>
                      {p.username && <p className="text-[10px] text-muted-foreground">/{p.username}</p>}
                    </div>
                    {p.id === activeProfile?.id && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          borderTop: "1px solid hsl(210 20% 91% / 0.6)",
        }}
      >
        {/* Page switcher pill */}
        {hasMultipleProfiles && (
          <button
            onClick={() => setShowSwitcher(!showSwitcher)}
            className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/60 shadow-md text-[10px] font-medium text-primary bg-white/95 backdrop-blur-sm"
          >
            <FileText className="w-3 h-3" />
            <span className="truncate max-w-20">{activeProfile?.display_name || "Page"}</span>
            <ChevronUp className={`w-3 h-3 transition-transform ${showSwitcher ? "rotate-180" : ""}`} />
          </button>
        )}

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
    </>
  );
}
