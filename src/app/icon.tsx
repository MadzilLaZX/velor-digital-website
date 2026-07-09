import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 14,
        }}
      >
        <svg width="34" height="28" viewBox="0 0 48 40" fill="none">
          <path d="M0 2 L18 2 L24 30 L30 2 L48 2 L27.5 38 L20.5 38 Z" fill="#eef1f2" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
