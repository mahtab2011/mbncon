"use client";

import type {
  ReactNode,
} from "react";

interface TracingWorkspaceGridProps {
  canvas: ReactNode;

  leftPanel?: ReactNode;

  rightPanel?: ReactNode;

  bottomPanel?: ReactNode;

  leftPanelWidth?: string;

  rightPanelWidth?: string;
}

export default function TracingWorkspaceGrid({
  canvas,

  leftPanel,

  rightPanel,

  bottomPanel,

  leftPanelWidth = "320px",

  rightPanelWidth = "360px",
}: TracingWorkspaceGridProps) {
  return (
    <section className="space-y-6">
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns:
            leftPanel && rightPanel
              ? `${leftPanelWidth} minmax(0, 1fr) ${rightPanelWidth}`
              : leftPanel
                ? `${leftPanelWidth} minmax(0, 1fr)`
                : rightPanel
                  ? `minmax(0, 1fr) ${rightPanelWidth}`
                  : "minmax(0, 1fr)",
        }}
      >
        {leftPanel ? (
          <aside className="space-y-6">
            {leftPanel}
          </aside>
        ) : null}

        <div className="min-w-0">
          {canvas}
        </div>

        {rightPanel ? (
          <aside className="space-y-6">
            {rightPanel}
          </aside>
        ) : null}
      </div>

      {bottomPanel ? (
        <div className="space-y-6">
          {bottomPanel}
        </div>
      ) : null}
    </section>
  );
}