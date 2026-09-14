import { findProjectById, portfolio } from "@/content/portfolio";

export function ExperienceSection() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Structural placeholders only. Real companies, dates and outcomes are added once you supply
        your CV.
      </p>

      <ol className="space-y-5">
        {portfolio.experience.map((entry) => (
          <li
            key={entry.id}
            className="rounded-lg border border-border bg-surface/60 p-4 backdrop-blur-sm"
          >
            <h3 className="text-base font-semibold text-foreground">{entry.company}</h3>
            <p className="text-sm text-accent">{entry.role}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {entry.startDate} — {entry.endDate}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{entry.summary}</p>

            <Detail title="Contributions" items={entry.contributions} />
            <Detail title="Outcomes" items={entry.outcomes} />

            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>

            {entry.relatedProjectIds.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Related projects:{" "}
                {entry.relatedProjectIds.map((id) => findProjectById(id)?.title ?? id).join(", ")}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Detail({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-3">
      <h4 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</h4>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
