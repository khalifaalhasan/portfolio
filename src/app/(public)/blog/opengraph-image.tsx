import { ImageResponse } from "next/og";
import { DATA } from "@/data/resume";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// PENTING: Wajib 'nodejs' karena kita pakai 'fs' dan 'process.cwd()'
export const runtime = "nodejs";

export const alt = "Blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Helper untuk load font
const getFontData = async () => {
  try {
    const cabinetGroteskPath = join(
      process.cwd(),
      "public/fonts/CabinetGrotesk-Medium.ttf",
    );
    const clashDisplayPath = join(
      process.cwd(),
      "public/fonts/ClashDisplay-Semibold.ttf",
    );

    const cabinetGroteskData = readFileSync(cabinetGroteskPath);
    const clashDisplayData = readFileSync(clashDisplayPath);

    return {
      cabinetGrotesk: cabinetGroteskData,
      clashDisplay: clashDisplayData,
    };
  } catch (error) {
    // Throw error agar Next.js tau build gagal karena asset hilang
    throw new Error(
      `Failed to load fonts: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

export default async function Image() {
  try {
    const fonts = await getFontData();

    // Data Logic
    const title = "Blog";
    const description =
      DATA.description || "Thoughts on software development, life, and more.";

    // Pastikan URL image valid
    const imageUrl = DATA.avatarUrl
      ? new URL(DATA.avatarUrl, DATA.url).toString()
      : undefined;

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          padding: "40px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fafafa",
            padding: "40px",
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            position: "relative",
          }}
        >
          {/* Avatar Image */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Avatar"
              style={{
                position: "absolute",
                top: "40px",
                left: "40px",
                width: "140px",
                height: "140px",
                borderRadius: "24px",
                border: "4px solid #e5e5e5",
                objectFit: "cover",
              }}
            />
          )}

          {/* Text Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              height: "100%",
              width: "100%",
            }}
          >
            <div
              style={{
                fontFamily: '"Clash Display"',
                fontSize: "64px", // Saya perbesar sedikit agar lebih pop
                fontWeight: 600,
                lineHeight: "1.1",
                color: "#000000",
                marginBottom: "20px",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </div>

            {description && (
              <div
                style={{
                  fontSize: "24px",
                  fontFamily: '"Cabinet Grotesk"',
                  fontWeight: 400,
                  lineHeight: "1.5",
                  color: "#404040",
                  maxWidth: "800px",
                }}
              >
                {description}
              </div>
            )}
          </div>
        </div>
      </div>,
      {
        ...size,
        fonts: [
          {
            name: "Cabinet Grotesk",
            data: fonts.cabinetGrotesk,
            weight: 400, // Sesuaikan dengan file font (Medium biasanya 500, tapi 400 aman)
            style: "normal",
          },
          {
            name: "Clash Display",
            data: fonts.clashDisplay,
            weight: 600, // Semibold
            style: "normal",
          },
        ],
      },
    );
  } catch (error) {
    console.error("Error generating OpenGraph image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
