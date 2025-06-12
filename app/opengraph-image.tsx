import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Euro Negoce - International Trade & Agricultural Products"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        background: "linear-gradient(to bottom right, #e0f2fe, #dcfce7)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px",
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          background: "linear-gradient(to right, #166534, #1e40af)",
          backgroundClip: "text",
          color: "transparent",
          marginBottom: 40,
        }}
      >
        Euro Negoce
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 600,
          color: "#1f2937",
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        Bridging Continents with Quality Goods
      </div>
      <div
        style={{
          fontSize: 24,
          color: "#4b5563",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        Premium agricultural products and international trade solutions
      </div>
    </div>,
    {
      ...size,
    },
  )
}
