"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { auditLog, demoAdminId, type AuditLogEntry } from "@/lib/fixtures/operations";

/**
 * Prototype audit trail. Lives in the /admin layout so entries appended on
 * one admin screen survive navigation to another. Client state only —
 * a reload resets it to the fixture log.
 */
type AuditContextValue = {
  entries: AuditLogEntry[];
  record: (action: string, entityLabel: string) => void;
};

const AuditContext = createContext<AuditContextValue | null>(null);

function now() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AuditProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<AuditLogEntry[]>(() =>
    [...auditLog].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
  );

  const record = useCallback((action: string, entityLabel: string) => {
    setEntries((prev) => [
      {
        id: `audit-local-${prev.length + 1}`,
        actorId: demoAdminId,
        actorRole: "admin",
        action,
        entityLabel,
        timestamp: now(),
      },
      ...prev,
    ]);
  }, []);

  const value = useMemo(() => ({ entries, record }), [entries, record]);
  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
}

export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error("useAudit must be used inside the /admin layout");
  return ctx;
}

export function AuditStrip({ limit = 3 }: { limit?: number }) {
  const { entries } = useAudit();
  const shown = entries.slice(0, limit);
  return (
    <section aria-labelledby="audit-heading" className="mt-8 border-t border-hairline pt-4">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="audit-heading" className="text-[1.125rem] font-semibold leading-tight">
          Audit log
        </h2>
        <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-soft">
          Every privileged action is audited
        </p>
      </div>
      <ol aria-live="polite" className="flex flex-col rounded-[6px] border border-hairline bg-surface">
        {shown.map((e) => (
          <li key={e.id} className="border-t border-hairline px-4 py-2.5 first:border-t-0">
            <p className="text-[0.875rem]">
              <span className="font-mono text-[0.8125rem]">{e.actorId}</span> {e.action}
            </p>
            <p className="break-words text-[0.8125rem] text-ink-soft">{e.entityLabel}</p>
            <p className="font-mono text-[0.6875rem] text-ink-soft">
              {e.timestamp} · {e.actorRole}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
