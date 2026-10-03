import type { ProjectMetric } from "@/data/types";

interface ProjectMetricsProps {
  metrics?: ProjectMetric[];
  className?: string;
}

export default function ProjectMetrics({ metrics, className = "" }: ProjectMetricsProps) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div
      className={`project-detail__metrics ${className}`.trim()}
      aria-label="Project key metrics"
      data-project-metrics
    >
      {metrics.map((metric) => (
        <div
          key={`${metric.label}-${metric.value}`}
          className="project-detail__metric-card"
          data-metric-card
        >
          <div className="project-detail__metric-indicator" aria-hidden="true" />
          <strong className="project-detail__metric-value">{metric.value}</strong>
          <span className="project-detail__metric-label">{metric.label}</span>
          {metric.comparison ? (
            <div className="project-detail__metric-comparison" data-metric-comparison>
              <span className="project-detail__metric-comparison-icon" aria-hidden="true">⚡</span>
              <span>{metric.comparison}</span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
