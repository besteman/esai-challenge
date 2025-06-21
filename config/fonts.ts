import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Adobe Typekit font
export const fontChorine = {
  variable: "--font-chorine",
  style: {
    fontFamily: '"chorine-large", sans-serif',
    fontWeight: 500,
    fontStyle: "normal",
  },
};
