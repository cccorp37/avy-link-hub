import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp, resetPassword } from "@/lib/supabase-auth";
import { useToast } from "@/hooks/use-toast";

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
          <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center shadow-blue">
            <Link2 className="w-4 h-4 text-primary-foreground" />
          </div>
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

export default AuthModal;
