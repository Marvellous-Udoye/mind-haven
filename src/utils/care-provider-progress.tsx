import { ReactNode } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ProgressRing from "../components/ui/progress-ring";
import { CareProviderProgress } from "../hooks/use-care-provider-progress";

const progressMeta = {
  basic: { percent: 10, button: "Set up profile", route: "/care-provider/profile/setup/step-1" },
  professional: { percent: 70, button: "Setup your profile", route: "/care-provider/profile/setup/step-2" },
  documents: { percent: 70, button: "Continue", route: "/care-provider/profile/setup/step-3" },
};

export function getProgressBlockingUI(
  progress: CareProviderProgress,
  router: AppRouterInstance
): ReactNode | null {
  if (progress === "awaiting") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="rounded-4xl bg-[#121212] p-6 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/10">
<svg xmlns="http://www.w3.org/2000/svg" width="71" height="82" viewBox="0 0 71 82" fill="none">
  <path d="M67.1602 75.7266H65.5781C65.5898 75.6094 65.6016 75.4805 65.6016 75.3516V66.6914C65.6016 65.918 65.2969 65.168 64.7461 64.6172L57.0469 56.9297L64.7461 49.2305C65.2969 48.6797 65.6016 47.9414 65.6016 47.1563V37.7578H67.1602C68.7773 37.7578 70.0898 36.4453 70.0898 34.8281C70.0898 33.2109 68.7773 31.8984 67.1602 31.8984H38.4141C36.7969 31.8984 35.4844 33.2109 35.4844 34.8281C35.4844 36.4453 36.7969 37.7578 38.4141 37.7578H39.9727V46.9219C39.9727 47.6953 40.2773 48.4453 40.8281 48.9961L48.7617 56.9297L40.8281 64.8633C40.2773 65.4141 39.9727 66.1523 39.9727 66.9375V75.3633C39.9727 75.4922 39.9844 75.6094 39.9961 75.7383H38.4141C36.7969 75.7383 35.4844 77.0508 35.4844 78.668C35.4844 80.2852 36.7969 81.5977 38.4141 81.5977H67.1602C68.7773 81.5977 70.0898 80.2852 70.0898 78.668C70.0898 77.0508 68.7773 75.7266 67.1602 75.7266ZM45.832 37.7578H59.7422V45.9375L52.8984 52.7813L45.8203 45.7031V37.7578H45.832ZM45.832 75.3516V68.1328L52.9102 61.0547L59.7539 67.8984V75.3516C59.7539 75.4805 59.7656 75.5977 59.7773 75.7266H45.8086C45.8203 75.6094 45.832 75.4805 45.832 75.3516ZM49.875 0H3.51563C1.57031 0 0 1.57031 0 3.51562C0 5.46094 1.57031 7.03125 3.51563 7.03125H49.8867C51.832 7.03125 53.4023 5.46094 53.4023 3.51562C53.4023 1.57031 51.8203 0 49.875 0ZM53.3906 22.6641C53.3906 20.7188 51.8203 19.1484 49.875 19.1484H3.51563C1.57031 19.1484 0 20.7188 0 22.6641C0 24.6094 1.57031 26.1797 3.51563 26.1797H49.8867C51.8203 26.1797 53.3906 24.6094 53.3906 22.6641ZM18.75 38.3086H3.51563C1.57031 38.3086 0 39.8789 0 41.8242C0 43.7695 1.57031 45.3398 3.51563 45.3398H18.75C20.6953 45.3398 22.2656 43.7695 22.2656 41.8242C22.2656 39.8789 20.6836 38.3086 18.75 38.3086ZM18.75 57.4688H3.51563C1.57031 57.4688 0 59.0391 0 60.9844C0 62.9297 1.57031 64.5 3.51563 64.5H18.75C20.6953 64.5 22.2656 62.9297 22.2656 60.9844C22.2656 59.0391 20.6836 57.4688 18.75 57.4688Z" fill="white"/>
</svg>          </div>
          <p className="text-lg font-semibold">Waiting for Approval</p>
          <p className="mt-2 text-sm text-white/60">
            Kindly hold on while we review your profile details.
          </p>
        </div>
      </div>
    );
  }

  if (progress === "approved") return null;

  const meta = progressMeta[progress];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <div className="rounded-4xl bg-[#111111] px-6 py-10 text-center w-full">
        <p className="text-lg font-semibold text-white">Complete Profile Setup</p>
        <div className="relative mx-auto my-8 flex h-40 w-40 items-center justify-center">
          <ProgressRing percent={meta.percent} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <p className="text-2xl font-semibold">{meta.percent}%</p>
            <p className="text-sm text-white/60">Complete</p>
          </div>
        </div>
        <button
          onClick={() => router.push(meta.route)}
          className="w-full rounded-2xl bg-white py-3 text-base font-semibold text-black"
        >
          {meta.button}
        </button>
      </div>
    </div>
  );
}
