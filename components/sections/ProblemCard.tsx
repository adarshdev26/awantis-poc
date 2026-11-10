type ProblemCardProps = {
  index: string;
  title: string;
  description: string;
};

export default function ProblemCard({
  index,
  title,
  description,
}: ProblemCardProps) {
  return (
    <article
      data-problem-card
      className="problem-card group relative border border-black/[0.07] bg-white/80 p-7 transition-[border-color,box-shadow] duration-300 md:min-h-[16rem] md:p-9"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-aw-blue transition-transform duration-300 group-[&.is-active]:scale-y-100"
      />

      <div className="mb-6 flex items-start justify-between gap-4">
        <span className="font-mono text-sm font-semibold tracking-[0.2em] text-aw-blue">
          {index}
        </span>
        <span
          aria-hidden
          className="relative mt-1 size-3 border border-aw-blue/30"
        >
          <span className="absolute -right-0.5 -top-0.5 size-1.5 bg-aw-yellow opacity-0 transition-opacity duration-300 group-[&.is-active]:opacity-100" />
        </span>
      </div>

      <h3 className="font-display text-[clamp(1.35rem,2vw,1.75rem)] font-bold leading-[1.15] tracking-[-0.02em] text-aw-ink">
        {title}
      </h3>
      <p className="mt-4 max-w-md text-base leading-[1.7] text-aw-muted">
        {description}
      </p>
    </article>
  );
}
