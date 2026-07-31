import { ImageResponse } from "next/og";
import { OPPORTUNITIES } from "@/lib/data/opportunities";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "GCIS — an index of what you're actually eligible for";

// Uses only system-safe fonts and flat fills; next/og has no access to the
// app's webfonts or CSS variables.
export default function OpengraphImage() {
  const h4 = OPPORTUNITIES.filter((o) => o.visaTrack === "h4").length;
  const f1 = OPPORTUNITIES.length - h4;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#e9e5da",
          color: "#17160f",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span
            style={{ fontSize: 26, letterSpacing: 6, fontFamily: "monospace" }}
          >
            GCIS
          </span>
          <span
            style={{
              fontSize: 22,
              letterSpacing: 4,
              fontFamily: "monospace",
              color: "#857f6d",
            }}
          >
            EST. INDEX
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, lineHeight: 1.02, letterSpacing: -2 }}>
            An index of what
          </div>
          {/* Satori requires an explicit display on any node with siblings. */}
          <div
            style={{
              display: "flex",
              fontSize: 96,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            <span>you can&nbsp;</span>
            <span style={{ color: "#b03714", fontStyle: "italic" }}>
              actually
            </span>
            <span>&nbsp;take.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 56,
            borderTop: "2px solid #17160f",
            paddingTop: 28,
            fontFamily: "monospace",
            fontSize: 24,
          }}
        >
          <span>H4 · {h4} entries</span>
          <span>F1 · {f1} entries</span>
          <span style={{ color: "#857f6d" }}>Refreshed daily</span>
        </div>
      </div>
    ),
    size,
  );
}
