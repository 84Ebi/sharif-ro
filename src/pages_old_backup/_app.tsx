import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Roboto_Mono } from "next/font/google";
import { useRouter } from 'next/router';

const GeistSans = Inter({ subsets: ["latin"] });
const GeistMono = Roboto_Mono({ subsets: ["latin"] });
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showNavbar = router.pathname !== '/';

  return (
    <>
      <style jsx global>{`
        :root {
          --font-geist-sans: ${GeistSans.style.fontFamily};
          --font-geist-mono: ${GeistMono.style.fontFamily};
        }
      `}</style>
      {showNavbar && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}
