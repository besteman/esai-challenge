import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
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
