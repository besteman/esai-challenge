import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Funnel_Display as FontFunnel,
  Anonymous_Pro as FontAnonymous,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontFunnel = FontFunnel({
  subsets: ["latin"],
  variable: "--font-funnel",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const fontAnonymous = FontAnonymous({
  subsets: ["latin"],
  variable: "--font-anonymous",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

// Droog font
export const fontDroog = {
  variable: "--font-droog",
  style: {
    fontFamily: '"droog", sans-serif',
    fontWeight: 900,
    fontStyle: "normal",
  },
};
