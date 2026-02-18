import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { Loader2 } from "lucide-react";
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


type Profile = Tables<"profiles">;

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Vue d'ensemble",
  "/dashboard/page": "Ma Page",
  "/dashboard/liens": "Liens",
  "/dashboard/apparence": "Apparence",
  "/dashboard/analytics": "Analytics",
  "/dashboard/parametres": "Paramètres",
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/");
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-secondary/20">
      <DashboardSidebar profile={profile} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <DashboardTopbar profile={profile} title="Vue d'ensemble" />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
                  <DashboardOverview profile={profile} />
                </main>
              </>
            }
          />
          <Route
            path="/page"
            element={
              <>
                <DashboardTopbar profile={profile} title="Ma Page" />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
                  <DashboardPage profile={profile} onUpdate={updateProfile} />
                </main>
              </>
            }
          />
          <Route
            path="/liens"
            element={
              <>
                <DashboardTopbar profile={profile} title="Liens" />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
                  <DashboardLinks profile={profile} />
                </main>
              </>
            }
          />
          <Route
            path="/apparence"
            element={
              <>
                <DashboardTopbar profile={profile} title="Apparence" />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
                  <DashboardAppearance profile={profile} onUpdate={updateProfile} />
                </main>
              </>
            }
          />
          <Route
            path="/analytics"
            element={
              <>
                <DashboardTopbar profile={profile} title="Analytics" />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
                  <DashboardAnalytics profile={profile} />
                </main>
              </>
            }
          />
          <Route
            path="/parametres"
            element={
              <>
                <DashboardTopbar profile={profile} title="Paramètres" />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
                  <DashboardSettings profile={profile} onUpdate={updateProfile} />
                </main>
              </>
            }
          />
          <Route
            path="/modeles"
            element={
              <>
                <DashboardTopbar profile={profile} title="Modèles" />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
                  <DashboardTemplates profile={profile} />
                </main>
              </>
            }
          />
          <Route
            path="/integrations"
            element={
              <>
                <DashboardTopbar profile={profile} title="Intégrations" />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
                  <DashboardIntegrations profile={profile} />
                </main>
              </>
            }
          />
        </Routes>
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default Dashboard;
