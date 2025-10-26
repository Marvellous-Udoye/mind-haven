import { ReactNode, Suspense } from "react";
import MobileContainer from "../../../components/mobile-container";
import CareSeekerBottomNav from "../../../components/care-seeker/bottom-nav";
import { CareSeekerProvider } from "../../../hooks/use-care-seeker-experience";

export default function CareSeekerLayout({ children }: { children: ReactNode }) {
  return (
    <CareSeekerProvider>
      <MobileContainer>
        <div className="relative flex min-h-dvh flex-col bg-[#0d0d0d] px-6 pb-28 pt-8 text-white">
          <div className="flex-1">{children}</div>
          <Suspense fallback={<div className="h-16" />}>
            <CareSeekerBottomNav />
          </Suspense>
        </div>
      </MobileContainer>
    </CareSeekerProvider>
  );
}
