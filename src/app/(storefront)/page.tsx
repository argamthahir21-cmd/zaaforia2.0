"use client";

import { Suspense } from "react";
import { HeroSection }    from "@/components/home/HeroSection";
import { PromoBanner }     from "@/components/home/PromoBanner";
import { CategoryGrid }     from "@/components/home/CategoryGrid";
import { NewArrivalsStrip } from "@/components/home/NewArrivalsStrip";
import { EditorialBanner }  from "@/components/home/EditorialBanner";
import { StyleEdit }        from "@/components/home/StyleEdit";
import { TrendingGrid }     from "@/components/home/TrendingGrid";
import { TrustStrip }       from "@/components/home/TrustStrip";
import { InstagramFeed }    from "@/components/home/InstagramFeed";
import { MembershipStrip }  from "@/components/home/MembershipStrip";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <PromoBanner />
      <CategoryGrid />
      <Suspense fallback={null}>
        <NewArrivalsStrip />
      </Suspense>
      <MembershipStrip />
      <EditorialBanner />
      <StyleEdit />
      <Suspense fallback={null}>
        <TrendingGrid />
      </Suspense>
      <TrustStrip />
      <InstagramFeed />
    </main>
  );
}
