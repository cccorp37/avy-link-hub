import { useState } from "react";
import { lovable } from "@/integrations/lovable";

import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp, resetPassword } from "@/lib/supabase-auth";
import { useToast } from "@/hooks/use-toast";
import avylinkLogo from "@/assets/avylink-logo.jpg";

type Mode = "login" | "signup" | "forgot";

interface AuthModalProps {
  defaultMode?: Mode;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal = ({ defaultMode = "login", onClose, onSuccess }: AuthModalProps) => {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "forgot") {
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Email envoyé ✉️", description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe." });
        setMode("login");
      }
      return;
    }

    if (mode === "signup") {
      const { error } = await signUp(email, password, fullName);
      setLoading(false);
      if (error) {
        toast({ title: "Erreur d'inscription", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Compte créé ! 🎉", description: "Vérifiez votre email pour confirmer votre compte." });
        onSuccess?.();
        onClose();
      }
      return;
    }

    // login
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Erreur de connexion", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bienvenue ! 👋", description: "Vous êtes connecté avec succès." });
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div
        className="relative bg-card rounded-3xl shadow-blue-lg w-full max-w-md p-8 border border-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img
            src={avylinkLogo}
            alt="AvyLink Logo"
            className="w-9 h-9 rounded-xl object-cover shadow-blue"
          />
          <span className="font-dm font-bold text-xl text-foreground">
            Avy<span className="text-gradient">Link</span>
          </span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="font-dm font-bold text-2xl text-foreground">
            {mode === "login" && "Connexion"}
            {mode === "signup" && "Créer un compte"}
            {mode === "forgot" && "Mot de passe oublié"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "login" && "Bon retour sur AvyLink 👋"}
            {mode === "signup" && "Rejoins +10 000 créateurs africains 🌍"}
            {mode === "forgot" && "Entrez votre email pour recevoir un lien de réinitialisation"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-foreground">Nom complet</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Kofi Asante"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 rounded-xl border-border focus:ring-primary"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 rounded-xl border-border focus:ring-primary"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Mot de passe</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 rounded-xl border-border focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === "login" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs text-primary hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-cta text-primary-foreground rounded-xl font-semibold shadow-blue hover:shadow-blue-lg transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Chargement...</span>
            ) : (
              <span className="flex items-center gap-2">
                {mode === "login" && "Se connecter"}
                {mode === "signup" && "Créer mon compte"}
                {mode === "forgot" && "Envoyer le lien"}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        {/* Social sign-in — only on login/signup */}
        {mode !== "forgot" && (
          <>
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">ou</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <AppleSignInButton onSuccess={onSuccess} onClose={onClose} />
          </>
        )}

        {/* Switch mode */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" && (
            <>Pas encore de compte ?{" "}
              <button onClick={() => setMode("signup")} className="text-primary font-semibold hover:underline">
                Créer un compte
              </button>
            </>
          )}
          {mode === "signup" && (
            <>Déjà un compte ?{" "}
              <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">
                Se connecter
              </button>
            </>
          )}
          {mode === "forgot" && (
            <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">
              Retour à la connexion
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Apple Sign-In Button ─────────────────────────────────────────────────────
function AppleSignInButton({ onSuccess, onClose }: { onSuccess?: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("apple");
      if (result.error) {
        toast({
          title: "Erreur Apple Sign In",
          description: (result.error as Error).message || "Une erreur est survenue",
          variant: "destructive",
        });
      } else if (!result.redirected) {
        toast({ title: "Bienvenue ! 👋", description: "Connecté avec Apple." });
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de se connecter avec Apple.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAppleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-foreground text-background hover:bg-foreground/90 transition-colors font-semibold text-sm disabled:opacity-60"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.38.07 2.33.74 3.13.77 1.2-.25 2.35-.96 3.62-.82 1.54.2 2.7.89 3.47 2.16-3.2 1.9-2.44 5.81.38 6.97-.57 1.52-1.33 3.01-2.6 3.8zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
      )}
      Continuer avec Apple
    </button>
  );
}

export default AuthModal;

