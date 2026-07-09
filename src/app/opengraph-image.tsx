import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "90px",
          background:
            "radial-gradient(circle at 78% 22%, rgba(63,217,199,0.22), transparent 55%), #050506",
          color: "#f2f3f4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <svg width="30" height="25" viewBox="0 0 48 40" fill="none">
            <path d="M0 2 L18 2 L24 30 L30 2 L48 2 L27.5 38 L20.5 38 Z" fill="#eef1f2" />
          </svg>
          <span style={{ fontSize: 24, letterSpacing: 8, fontWeight: 600 }}>VELOR</span>
        </div>
        <div style={{ display: "flex", fontSize: 62, fontWeight: 600, lineHeight: 1.1, maxWidth: 900 }}>
          We build businesses that run smoother.
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 26, color: "#9a9da5", maxWidth: 820 }}>
          Websites, automation, marketing systems, and dashboards for service businesses
          across Ottawa &amp; Ontario.
        </div>
      </div>
    ),
    { ...size }
  );
}
