import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Aïsha Diallo",
    role: "Influenceuse Mode",
    country: "🇸🇳 Dakar, Sénégal",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Aisha&backgroundColor=ffb3d9&skinColor=brown",
    rating: 5,
    text: "Depuis que j'utilise AvyLink, mes ventes de mode ont triplé ! Ma page est si élégante que mes abonnés pensent que j'ai une agence derrière moi. En moins de 10 minutes tout était prêt.",
    plan: "Premium",
    verified: true,
  },
  {
    name: "Kwame Mensah",
    role: "Photographe & Vidéaste",
    country: "🇬🇭 Accra, Ghana",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Kwame&backgroundColor=b6e3f4&skinColor=darkBrown",
    rating: 5,
    text: "AvyLink m'a permis de centraliser mon portfolio, mon Instagram et ma boutique en un seul endroit. Je gagne 2x plus de clients depuis 3 mois. Le meilleur investissement de l'année !",
    plan: "Business",
    verified: true,
  },
  {
    name: "Marie-Claire Koffi",
    role: "Coach Bien-être",
    country: "🇨🇮 Abidjan, Côte d'Ivoire",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Marie&backgroundColor=ffd5dc&skinColor=brown",
    rating: 5,
    text: "Super facile à utiliser ! J'ai créé ma page en 10 minutes et mes clients trouvent tous mes services en un clic. Le support en français est parfait et très réactif. Je recommande !",
    plan: "Starter",
    verified: true,
  },
  {
    name: "Ibrahim Traoré",
    role: "Musicien & Beatmaker",
    country: "🇧🇫 Ouagadougou, Burkina Faso",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Ibrahim&backgroundColor=c0aede&skinColor=darkBrown",
    rating: 5,
    text: "J'ai connecté Spotify, YouTube et ma boutique de beats sur une seule page. En 2 mois, j'ai doublé mes streams et mes ventes. AvyLink a vraiment changé ma carrière musicale !",
    plan: "Premium",
    verified: true,
  },
  {
    name: "Fatou Sarr",
    role: "Entrepreneuse & Coach Business",
    country: "🇸🇳 Thiès, Sénégal",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Fatou&backgroundColor=d1f4d1&skinColor=brown",
    rating: 5,
    text: "Je cherchais une solution africaine adaptée à nos réalités. AvyLink accepte les paiements en FCFA et comprend nos besoins. Le plan gratuit est déjà incroyable pour démarrer.",
    plan: "Gratuit",
    verified: true,
  },
  {
    name: "Chidi Okafor",
    role: "Développeur & Consultant Tech",
    country: "🇳🇬 Lagos, Nigeria",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Chidi&backgroundColor=b6e3f4&skinColor=darkBrown",
    rating: 5,
    text: "As a tech consultant, I need a professional online presence. AvyLink gives me that instantly. The analytics are detailed and the page loads super fast even on 3G. Highly recommended!",
    plan: "Business",
    verified: true,
  },
];

const Reviews = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 glass-blue px-4 py-2 rounded-full text-sm font-medium text-primary">
            <Star className="w-4 h-4 fill-primary" />
            Note moyenne 4.9/5 — 2 847 avis
          </div>
          <h2 className="font-dm font-bold text-4xl md:text-5xl text-foreground tracking-tight">
            Ce que disent nos
            <br />
            <span className="text-gradient">créateurs africains</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Des milliers de créateurs de toute l'Afrique nous font confiance chaque jour.
          </p>
        </div>

        {/* Rating summary */}
        <div className="flex justify-center mb-12">
          <div className="glass rounded-3xl px-8 py-5 flex flex-wrap items-center gap-8 justify-center">
            <div className="text-center">
              <div className="font-dm font-bold text-5xl text-foreground">4.9</div>
              <div className="flex justify-center mt-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-warning text-warning" />)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">sur 5 étoiles</div>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            {[
              { stars: 5, pct: 91 },
              { stars: 4, pct: 7 },
              { stars: 3, pct: 2 },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground w-8 text-right">{row.stars}★</span>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full gradient-cta" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="text-muted-foreground w-8">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-card rounded-3xl p-6 shadow-card border border-border/50 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Quote icon */}
              <Quote className="w-6 h-6 text-primary/30 mb-3 flex-shrink-0" />

              {/* Review text */}
              <p className="text-foreground/80 text-sm leading-relaxed flex-1 italic mb-5">
                "{review.text}"
              </p>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-11 h-11 rounded-full bg-muted flex-shrink-0 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-dm font-bold text-sm text-foreground truncate">{review.name}</span>
                    {review.verified && (
                      <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground text-[9px] font-bold">✓</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{review.role}</div>
                  <div className="text-xs text-muted-foreground">{review.country}</div>
                </div>
                <span className="glass-blue text-primary text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                  {review.plan}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">
            🌟 Rejoins <strong className="text-foreground">+10 000 créateurs</strong> qui font confiance à AvyLink en Afrique et dans le monde
          </p>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
