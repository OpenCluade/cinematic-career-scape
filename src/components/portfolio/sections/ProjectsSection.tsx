import { portfolio } from "@/content/portfolio";

export function ProjectsSection() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Structural placeholders only. No metrics or results are shown until you provide them.
      </p>

      <ol className="space-y-5">
        {portfolio.projects.map((project) => (
          <li
            key={project.id}
            className="border-l-2 border-border/80 pl-4"
          >
            <h3 className="text-base font-semibold text-foreground">{project.title}</h3>

            <Block title="Problem" body={project.problem} />
            <Block title="My contribution" body={project.contribution} />
            <List title="Architecture and decisions" items={project.architecture} />
            <List title="Results" items={project.results} />

            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-3">
      <h4 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
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
