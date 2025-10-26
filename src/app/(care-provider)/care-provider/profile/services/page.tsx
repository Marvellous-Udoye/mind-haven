"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SimpleModal from "../../../../../components/ui/simple-modal";

type Service = { id: string; name: string; charge: string };

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([
    { id: "clinic", name: "Clinic consultation", charge: "₦20,000" },
    { id: "home", name: "Home service", charge: "₦35,000" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", charge: "" });

  const saveService = () => {
    if (!form.name || !form.charge) return;
    setServices((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: form.name, charge: form.charge },
    ]);
    setForm({ name: "", charge: "" });
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => router.push("/care-provider/profile")}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
      >
        <ArrowLeft size={20} />
      </button>

      <h1 className="text-xl font-semibold text-[#52c340]">Services</h1>

      <div className=" space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold">{service.name}</p>
              <p className="text-white/60">{service.charge}</p>
            </div>
            <button
              className="text-red-400"
              onClick={() =>
                setServices((prev) => prev.filter((item) => item.id !== service.id))
              }
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={() => setModalOpen(true)}
          className="w-full rounded-2xl bg-white py-3 text-base font-semibold text-black"
        >
          Add service
        </button>
      </div>

      <SimpleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add service"
      >
        <div className="space-y-4">
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-2xl border border-white/15 bg-[#073133] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
            placeholder="Service name"
          />
          <input
            value={form.charge}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, charge: e.target.value }))
            }
            className="w-full rounded-2xl border border-white/15 bg-[#073133] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
            placeholder="Service charge"
          />
          <button
            className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-black"
            onClick={saveService}
          >
            Done
          </button>
        </div>
      </SimpleModal>
    </div>
  );
}
