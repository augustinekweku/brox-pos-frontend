import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as ReactHotToaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";
import { authOptions } from "@/helpers/authOptions";

const sora = Sora({
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Nanitech EXP",
  description: "Nanitech EXP is a dashboard for managing your  store",
  icons: {
    icon: "/images/logo-light.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <SessionProvider session={session}>
        <Providers>
          <body className={sora.className} suppressHydrationWarning={true}>
            {children}
            <Toaster />
            <ReactHotToaster />
          </body>
        </Providers>
      </SessionProvider>
    </html>
  );
}
