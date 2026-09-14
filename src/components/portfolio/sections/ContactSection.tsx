import { portfolio } from "@/content/portfolio";

export function ContactSection() {
  const { contact } = portfolio;

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-muted-foreground">{contact.note}</p>

      <dl className="space-y-3">
        {contact.details.map((detail) => (
          <div key={detail.label} className="rounded-lg border border-border bg-surface/60 p-3">
            <dt className="text-xs font-medium tracking-wide text-accent uppercase">
              {detail.label}
            </dt>
            <dd className="mt-1 text-sm break-words text-foreground/90">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
