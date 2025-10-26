"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SimpleModal from "../../../../../components/ui/simple-modal";

interface BankAccount {
  id: string;
  name: string;
  number: string;
  bank: string;
}

export default function BankingDetailsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    number: "",
    holder: "",
    bank: "",
  });

  const handleAdd = () => {
    setAccounts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: form.holder, number: form.number, bank: form.bank },
    ]);
    setForm({ number: "", holder: "", bank: "" });
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

      <h1 className="text-xl font-semibold text-[#52c340]">Banking Details</h1>

      <div className=" space-y-4">
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-white/60">
            <span className="text-4xl text-[#52c340]">🏦</span>
            <p>No banking details available</p>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold">{account.name}</p>
                <p className="text-white/70">{account.number}</p>
                <p className="text-white/60">{account.bank}</p>
              </div>
              <button
                className="text-red-400"
                onClick={() =>
                  setAccounts((prev) => prev.filter((item) => item.id !== account.id))
                }
              >
                Delete
              </button>
            </div>
          ))
        )}

        <button
          onClick={() => setModalOpen(true)}
          className="w-full rounded-2xl bg-white py-3 text-base font-semibold text-black"
        >
          Add bank Payment
        </button>
      </div>

      <SimpleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Bank Details"
      >
        <div className="space-y-4">
          {["number", "holder", "bank"].map((field) => (
            <input
              key={field}
              value={form[field as keyof typeof form]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [field]: e.target.value }))
              }
              className="w-full rounded-2xl border border-white/15 bg-[#073133] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
              placeholder={
                field === "number"
                  ? "Account number"
                  : field === "holder"
                  ? "Bank Holder Name"
                  : "Bank Name"
              }
            />
          ))}
          <button
            className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-black"
            onClick={handleAdd}
          >
            Add bank Payment
          </button>
        </div>
      </SimpleModal>
    </div>
  );
}
