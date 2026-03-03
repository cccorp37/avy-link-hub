import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  created_at: string;
  user_id: string;
}

export default function AdminTickets() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTickets((data as Ticket[]) || []);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("support_tickets").update({ status } as never).eq("id", id);
    if (!error) {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      toast({ title: "Statut mis à jour" });
    }
  };

  const filtered = filterStatus === "all" ? tickets : tickets.filter(t => t.status === filterStatus);

  const priorityBadge = (p: string) => {
    const styles: Record<string, string> = { urgent: "bg-destructive/10 text-destructive", high: "bg-yellow-500/10 text-yellow-600", normal: "bg-primary/10 text-primary", low: "bg-muted text-muted-foreground" };
    return <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${styles[p] || styles.normal}`}>{p}</span>;
  };

  const statusIcon = (s: string) => {
    if (s === "resolved" || s === "closed") return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (s === "in_progress") return <Clock className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-dm font-bold text-2xl text-foreground">Tickets de support</h2>
          <p className="text-sm text-muted-foreground">{tickets.filter(t => t.status === "open").length} ticket(s) ouvert(s)</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="open">Ouverts</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
            <SelectItem value="resolved">Résolus</SelectItem>
            <SelectItem value="closed">Fermés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Aucun ticket</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ticket => (
            <div key={ticket.id} className="bg-card rounded-2xl border border-border/50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {statusIcon(ticket.status)}
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ticket.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {priorityBadge(ticket.priority)}
                      <span className="text-[11px] text-muted-foreground">{new Date(ticket.created_at).toLocaleString("fr-FR")}</span>
                    </div>
                  </div>
                </div>
                <Select value={ticket.status} onValueChange={v => updateStatus(ticket.id, v)}>
                  <SelectTrigger className="w-[130px] rounded-xl text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Ouvert</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="resolved">Résolu</SelectItem>
                    <SelectItem value="closed">Fermé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
