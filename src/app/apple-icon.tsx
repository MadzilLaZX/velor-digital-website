import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050506",
        }}
      >
        <svg width="96" height="80" viewBox="0 0 48 40" fill="none">
          <path d="M0 2 L18 2 L24 30 L30 2 L48 2 L27.5 38 L20.5 38 Z" fill="#eef1f2" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
