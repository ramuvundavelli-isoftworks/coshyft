import React from 'react';
import { cn } from '../ui/utils';

interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Optional subtitle / description */
  description?: string;
  /** Optional breadcrumb element or back-link */
  breadcrumb?: React.ReactNode;
  /** Action buttons rendered on the right */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader — consistent heading block used at the top of every page.
 *
 * Usage
 * ─────
 *   import { PageHeader } from '@/app/components/global';
 *
 *   <PageHeader
 *     title="Emissions Overview"
 *     description="Scope 3 commuting data for all locations."
 *     actions={<Button>Export</Button>}
 *   />
 */
export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      {breadcrumb && (
        <div className="mb-2 text-sm text-muted-foreground">{breadcrumb}</div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section — a labelled content block within a page                   */
/* ------------------------------------------------------------------ */

interface SectionProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Section — wraps a related group of content with an optional heading.
 *
 * Usage
 * ─────
 *   import { Section } from '@/app/components/global';
 *
 *   <Section title="Monthly Trends" description="Last 12 months">
 *     <Chart />
 *   </Section>
 */
export function Section({ title, description, actions, children, className }: SectionProps) {
  return (
    <section className={cn('mb-8', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
