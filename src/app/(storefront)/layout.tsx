import { Navbar }    from "@/components/layout/Navbar";
import { Footer }    from "@/components/layout/Footer";
import { CinemaIntro } from "@/components/layout/CinemaIntro";

export default function StorefrontLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <CinemaIntro />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
