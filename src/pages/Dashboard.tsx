import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

// Sub-pages
import DashboardOverview from "./dashboard/DashboardOverview";
import DashboardPage from "./dashboard/DashboardPage";
import DashboardLinks from "./dashboard/DashboardLinks";
import DashboardAppearance from "./dashboard/DashboardAppearance";
import DashboardAnalytics from "./dashboard/DashboardAnalytics";
import DashboardSettings from "./dashboard/DashboardSettings";
import DashboardTemplates from "./dashboard/DashboardTemplates";
import DashboardIntegrations from "./dashboard/DashboardIntegrations";
import DashboardSupport from "./dashboard/DashboardSupport";
import DashboardTeam from "./dashboard/DashboardTeam";
import DashboardAPI from "./dashboard/DashboardAPI";
import DashboardHeatmap from "./dashboard/DashboardHeatmap";

type Profile = Tables<"profiles">;

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Vue d'ensemble",
  "/dashboard/page": "Ma Page",
  "/dashboard/liens": "Liens",
  "/dashboard/apparence": "Apparence",
  "/dashboard/analytics": "Analytics",
  "/dashboard/parametres": "Paramètres",
  "/dashboard/modeles": "Modèles",
  "/dashboard/integrations": "Intégrations",
  "/dashboard/support": "Support",
  "/dashboard/equipe": "Équipe",
  "/dashboard/api": "API & Webhooks",
  "/dashboard/heatmap": "Heatmap & A/B",
};

const ease = [0.22, 1, 0.36, 1] as const;
const pageVariants = {
  initial: { opacity: 0, x: 20, filter: "blur(4px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.35, ease } },
  exit: { opacity: 0, x: -20, filter: "blur(4px)", transition: { duration: 0.2, ease } },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 overflow-y-auto pb-20 md:pb-6"
    >
      {children}
    </motion.div>
  );
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const currentTitle = PAGE_TITLES[location.pathname] || "Dashboard";

  useEffect(() => {
    if (!loading && !user) {
      supabase.auth.getSession().then(({ data: { session: freshSession } }) => {
        if (!freshSession?.user) {
          navigate("/", { replace: true });
        }
      });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProfile(data);
      setProfileLoading(false);
    };
    loadProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    const { data } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id)
      .select()
      .single();
    if (data) setProfile(data);
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full" style={{ background: "hsl(210, 20%, 98%)" }}>
      <DashboardSidebar profile={profile} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashboardTopbar profile={profile} title={currentTitle} />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <AnimatedPage><DashboardOverview profile={profile} /></AnimatedPage>
            } />
            <Route path="/page" element={
              <AnimatedPage><DashboardPage profile={profile} onUpdate={updateProfile} /></AnimatedPage>
            } />
            <Route path="/liens" element={
              <AnimatedPage><DashboardLinks profile={profile} /></AnimatedPage>
            } />
            <Route path="/apparence" element={
              <AnimatedPage><DashboardAppearance profile={profile} onUpdate={updateProfile} /></AnimatedPage>
            } />
            <Route path="/analytics" element={
              <AnimatedPage><DashboardAnalytics profile={profile} /></AnimatedPage>
            } />
            <Route path="/parametres" element={
              <AnimatedPage><DashboardSettings profile={profile} onUpdate={updateProfile} /></AnimatedPage>
            } />
            <Route path="/modeles" element={
              <AnimatedPage><DashboardTemplates profile={profile} onUpdate={updateProfile} /></AnimatedPage>
            } />
            <Route path="/integrations" element={
              <AnimatedPage><DashboardIntegrations profile={profile} onUpdate={updateProfile} /></AnimatedPage>
            } />
            <Route path="/support" element={
              <AnimatedPage><DashboardSupport /></AnimatedPage>
            } />
            <Route path="/equipe" element={
              <AnimatedPage><DashboardTeam profile={profile} /></AnimatedPage>
            } />
            <Route path="/api" element={
              <AnimatedPage><DashboardAPI /></AnimatedPage>
            } />
            <Route path="/heatmap" element={
              <AnimatedPage><DashboardHeatmap profile={profile} /></AnimatedPage>
            } />
          </Routes>
        </AnimatePresence>

        <MobileBottomNav />
      </div>
    </div>
  );
};

export default Dashboard;
