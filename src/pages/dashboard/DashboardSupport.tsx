import { useState, useEffect } from "react";
import { Loader2, Send, MessageSquare, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  }),
};

const STATUS_MAP: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  open: { label: "Ouvert", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
  in_progress: { label: "En cours", icon: AlertCircle, color: "text-blue-600 bg-blue-50 border-blue-200" },
  resolved: { label: "Résolu", icon: CheckCircle2, color: "text-green-600 bg-green-50 border-green-200" },
};

export default function DashboardSupport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("normal");

  useEffect(() => {
    if (!user) return;
    loadTickets();
  }, [user]);

  const loadTickets = async () => {
    const { data } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });
    setTickets(data || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user || !subject.trim() || !message.trim()) return;
    setSending(true);
    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      subject: subject.trim(),
      message: message.trim(),
      priority,
    });
    if (error) {
      toast({ title: "Erreur", description: "Impossible d'envoyer le ticket.", variant: "destructive" });
    } else {
      toast({ title: "✅ Ticket envoyé !", description: "Notre équipe vous répondra sous 24h." });
      setSubject("");
      setMessage("");
      loadTickets();
    }
    setSending(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-dm font-bold text-lg text-foreground">Support 24h</h2>
            <p className="text-sm text-muted-foreground">Envoyez un ticket et recevez une réponse sous 24h par email</p>
          </div>
        </div>
      </motion.div>

      {/* New ticket form */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
        className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm p-5 space-y-4">
        <h3 className="font-dm font-bold text-base text-foreground">Nouveau ticket</h3>
        <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Sujet du ticket" className="rounded-xl" />
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Décrivez votre problème en détail..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <div className="flex items-center gap-3">
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-sm"
          >
            <option value="low">Basse priorité</option>
            <option value="normal">Normale</option>
            <option value="high">Haute priorité</option>
            <option value="urgent">Urgente</option>
          </select>
          <Button onClick={handleSubmit} disabled={sending || !subject.trim() || !message.trim()} className="ml-auto bg-primary text-primary-foreground rounded-xl">
            {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Envoyer
          </Button>
        </div>
      </motion.div>

      {/* Tickets list */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
        className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-border/50">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mes tickets ({tickets.length})</p>
        </div>
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">Aucun ticket pour le moment</p>
          </div>
        ) : (
          <AnimatePresence>
            {tickets.map((ticket, i) => {
              const status = STATUS_MAP[ticket.status] || STATUS_MAP.open;
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-5 py-4 border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ticket.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(ticket.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
