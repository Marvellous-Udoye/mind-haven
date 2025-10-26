import { ReactNode } from "react";
import MobileContainer from "../../../components/mobile-container";
import CareProviderBottomNav from "../../../components/care-provider/bottom-nav";

export default function CareProviderLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MobileContainer>
      <div className="relative flex min-h-dvh flex-col bg-[#0d0d0d] px-6 pb-28 pt-8 text-white">
        <div className="flex-1">{children}</div>
        <CareProviderBottomNav />
      </div>
    </MobileContainer>
  );
}
