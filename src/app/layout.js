import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Inter, Roboto, Poppins } from "next/font/google";
import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "First Next App",
  description: "This is the description",
};

export default async function RootLayout({ children }) {
  // get the session server-side and pass it down to SessionProvider
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      {/* suppressHydrationWarning prevents hydration mismatch warnings caused by browser extensions
          (e.g. Grammarly) that inject attributes into <body> on the client */}
      <body suppressHydrationWarning className={inter.className}>
        <ThemeProvider>
          <AuthProvider session={session}>
            <div className="container">
              <Navbar />
              {children}
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}