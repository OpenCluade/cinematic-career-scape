import { portfolio } from "@/content/portfolio";

export function AboutSection() {
  const { profile } = portfolio;

  return (
    <div className="space-y-6">
      <p className="text-base leading-relaxed text-foreground/90">{profile.introduction}</p>

      <section aria-labelledby="about-expertise" className="space-y-2">
        <h3
          id="about-expertise"
          className="text-sm font-medium tracking-wide text-accent uppercase"
        >
          Areas of expertise
        </h3>
        <ul className="flex flex-wrap gap-2">
          {profile.expertise.map((item) => (
            <li
              key={item}
              className="rounded-full border border-border bg-surface/70 px-3 py-1 text-sm text-foreground/90"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="about-value" className="space-y-2">
        <h3 id="about-value" className="text-sm font-medium tracking-wide text-accent uppercase">
          Value to organisations
        </h3>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          {profile.value.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
