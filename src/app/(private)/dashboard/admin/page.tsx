"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import apiClient from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ActionType = "verify" | "reject";

const STATUS_FILTERS = [
  "all",
  "initiated",
  "pending",
  "verified",
  "rejected",
] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const CATEGORY_LABELS: Record<string, string> = {
  scholarship: "Scholarships",
  infrastructure: "Infrastructure",
  innovation: "Innovation",
  alumni_activities: "Alumni Activities",
  general: "General",
};

interface Donor {
  _id: string;
  name: string;
  email: string;
}

interface AdminDonation {
  _id: string;
  donor: Donor;
  amount: number;
  donationCategory: string;
  status: string;
  utr?: string;
  payeeUpi?: string;
  proofImageUrl?: string;
  donorMessage?: string;
  proofSubmittedAt?: string;
  verificationNotes?: string;
  createdAt: string;
}

interface Analytics {
  overview: {
    total: number;
    pending: number;
    verified: number;
    rejected: number;
    initiated: number;
    totalVerifiedAmount: number;
    totalPendingAmount: number;
  };
  byCategory: { _id: string; count: number; totalAmount: number }[];
  byMonth: {
    year: number;
    month: number;
    count: number;
    totalAmount: number;
  }[];
  recentPending: AdminDonation[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    initiated: {
      label: "Initiated",
      className: "bg-secondary text-muted-foreground",
    },
    pending: {
      label: "Pending",
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    verified: {
      label: "Verified",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  };
  const cfg = map[status] ?? {
    label: status,
    className: "bg-secondary text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Action Modal ─────────────────────────────────────────────────────────────

interface ActionModalProps {
  donation: AdminDonation;
  action: ActionType;
  onClose: () => void;
  onSuccess: () => void;
}

function ActionModal({
  donation,
  action,
  onClose,
  onSuccess,
}: ActionModalProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await apiClient.post(`/api/admin/donations/${donation._id}/action`, {
        action,
        notes,
      });
      onSuccess();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || "Action failed.");
      } else {
        setError("Action failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-serif font-bold text-card-foreground">
          {action === "verify" ? "Verify Donation" : "Reject Donation"}
        </h2>

        <div className="bg-secondary/50 rounded-lg p-3 text-sm space-y-1">
          <p>
            <span className="font-medium">Donor:</span> {donation.donor.name} (
            {donation.donor.email})
          </p>
          <p>
            <span className="font-medium">Amount:</span> ₹
            {donation.amount.toLocaleString("en-IN")}
          </p>
          {donation.utr && (
            <p>
              <span className="font-medium">UTR:</span>{" "}
              <span className="font-mono">{donation.utr}</span>
            </p>
          )}
          {donation.proofImageUrl && (
            <a
              href={donation.proofImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              View Proof Image
            </a>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">
            Notes {action === "reject" ? "(required)" : "(optional)"}
          </label>
          <textarea
            className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            rows={3}
            placeholder={
              action === "verify"
                ? "Optional verification notes..."
                : "Reason for rejection..."
            }
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-destructive text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={loading || (action === "reject" && !notes.trim())}
            className={
              action === "verify"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
            {action === "verify" ? "Confirm Verify" : "Confirm Reject"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Analytics Tab ─────────────────────────────────────────────────────────────

function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await apiClient.get<Analytics>(
          "/api/admin/donations/analytics",
        );
        setAnalytics(data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data?.error || "Failed to load analytics.");
        } else {
          setError("Failed to load analytics.");
        }
      } finally {
        setLoading(false);
      }
    };
    void fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm">
        {error}
      </div>
    );
  }

  if (!analytics) return null;

  const { overview, byCategory, byMonth } = analytics;

  const kpis = [
    {
      label: "Total Donations",
      value: overview.total,
      sub: `₹${overview.totalVerifiedAmount.toLocaleString("en-IN")}`,
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      label: "Pending Review",
      value: overview.pending,
      sub: "needs action",
      icon: <Clock className="w-5 h-5 text-amber-500" />,
    },
    {
      label: "Verified",
      value: overview.verified,
      sub: `₹${overview.totalVerifiedAmount.toLocaleString("en-IN")}`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    },
    {
      label: "Rejected",
      value: overview.rejected,
      sub: "",
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
  ];

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="flex justify-center py-20">
      WIP
    </div>
    // <div className="space-y-8">
    //   {/* KPI Cards */}
    //   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    //     {kpis.map((k) => (
    //       <div key={k.label} className="bg-card rounded-xl p-4 card-shadow">
    //         <div className="flex justify-between items-start">
    //           <div>
    //             <p className="text-sm text-muted-foreground">{k.label}</p>
    //             <p className="text-2xl font-bold text-card-foreground mt-1">
    //               {k.value}
    //             </p>
    //             {k.sub && (
    //               <p className="text-xs text-muted-foreground mt-0.5">
    //                 {k.sub}
    //               </p>
    //             )}
    //           </div>
    //           <div className="text-muted-foreground">{k.icon}</div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {/* By Category */}
    //   <div className="bg-card rounded-xl p-5 card-shadow">
    //     <h3 className="font-semibold text-card-foreground mb-4">
    //       Donations by Category
    //     </h3>
    //     <div className="overflow-x-auto">
    //       <table className="w-full text-sm">
    //         <thead>
    //           <tr className="border-b border-border text-left">
    //             <th className="pb-2 font-medium text-muted-foreground">
    //               Category
    //             </th>
    //             <th className="pb-2 font-medium text-muted-foreground text-right">
    //               Count
    //             </th>
    //             <th className="pb-2 font-medium text-muted-foreground text-right">
    //               Total Amount
    //             </th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {byCategory.map((row) => (
    //             <tr
    //               key={row._id}
    //               className="border-b border-border/50 last:border-0"
    //             >
    //               <td className="py-2 text-card-foreground">
    //                 {CATEGORY_LABELS[row._id] ?? row._id}
    //               </td>
    //               <td className="py-2 text-card-foreground text-right">
    //                 {row.count}
    //               </td>
    //               <td className="py-2 text-card-foreground text-right">
    //                 ₹{row.totalAmount.toLocaleString("en-IN")}
    //               </td>
    //             </tr>
    //           ))}
    //           {byCategory.length === 0 && (
    //             <tr>
    //               <td
    //                 colSpan={3}
    //                 className="py-4 text-center text-muted-foreground"
    //               >
    //                 No data
    //               </td>
    //             </tr>
    //           )}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>

    //   {/* Monthly Trends */}
    //   <div className="bg-card rounded-xl p-5 card-shadow">
    //     <h3 className="font-semibold text-card-foreground mb-4">
    //       Monthly Trends
    //     </h3>
    //     <div className="overflow-x-auto">
    //       <table className="w-full text-sm">
    //         <thead>
    //           <tr className="border-b border-border text-left">
    //             <th className="pb-2 font-medium text-muted-foreground">
    //               Month
    //             </th>
    //             <th className="pb-2 font-medium text-muted-foreground text-right">
    //               Count
    //             </th>
    //             <th className="pb-2 font-medium text-muted-foreground text-right">
    //               Total Amount
    //             </th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {byMonth.map((row) => (
    //             <tr
    //               key={`${row.year}-${row.month}`}
    //               className="border-b border-border/50 last:border-0"
    //             >
    //               <td className="py-2 text-card-foreground">
    //                 {monthNames[(row.month - 1) % 12]} {row.year}
    //               </td>
    //               <td className="py-2 text-card-foreground text-right">
    //                 {row.count}
    //               </td>
    //               <td className="py-2 text-card-foreground text-right">
    //                 ₹{row.totalAmount.toLocaleString("en-IN")}
    //               </td>
    //             </tr>
    //           ))}
    //           {byMonth.length === 0 && (
    //             <tr>
    //               <td
    //                 colSpan={3}
    //                 className="py-4 text-center text-muted-foreground"
    //               >
    //                 No data
    //               </td>
    //             </tr>
    //           )}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </div>
  );
}

// ─── Donations Tab ────────────────────────────────────────────────────────────

function DonationsTab() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [page, setPage] = useState(1);
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<{
    donation: AdminDonation;
    action: ActionType;
  } | null>(null);
  const refreshRef = useRef(0);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await apiClient.get<{
        donations: AdminDonation[];
        total: number;
        totalPages: number;
      }>(`/api/admin/donations?status=${statusFilter}&page=${page}&limit=15`);
      setDonations(data.donations);
      setTotalPages(data.totalPages);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || "Failed to load donations.");
      } else {
        setError("Failed to load donations.");
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, refreshRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    void fetchDonations();
  }, [fetchDonations]);

  const handleFilterChange = (f: StatusFilter) => {
    setStatusFilter(f);
    setPage(1);
  };

  const handleActionSuccess = () => {
    refreshRef.current += 1;
  };

  return (
    <>
      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleFilterChange(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              statusFilter === s
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-muted-foreground hover:bg-accent/10"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm">
          {error}
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No {statusFilter !== "all" ? statusFilter : ""} donations found.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {donations.map((d) => (
              <div
                key={d._id}
                className="bg-card rounded-xl p-4 card-shadow flex flex-col lg:flex-row lg:items-center gap-4"
              >
                {/* Donor info */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-card-foreground">
                      {d.donor.name}
                    </span>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {d.donor.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {CATEGORY_LABELS[d.donationCategory] ?? d.donationCategory}
                  </p>
                  {d.donorMessage && (
                    <p className="text-xs text-muted-foreground italic">
                      &ldquo;{d.donorMessage}&rdquo;
                    </p>
                  )}
                </div>

                {/* Amount + proof */}
                <div className="flex-shrink-0 text-right space-y-0.5">
                  <p className="text-xl font-bold text-card-foreground">
                    ₹{d.amount.toLocaleString("en-IN")}
                  </p>
                  {d.utr && (
                    <p className="text-xs font-mono text-muted-foreground">
                      UTR: {d.utr}
                    </p>
                  )}
                  {d.proofImageUrl && (
                    <a
                      href={d.proofImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline"
                    >
                      View Proof
                    </a>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {d.proofSubmittedAt
                      ? `Proof: ${fmt(d.proofSubmittedAt)}`
                      : `Created: ${fmt(d.createdAt)}`}
                  </p>
                </div>

                {/* Actions */}
                {d.status === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() =>
                        setModal({ donation: d, action: "verify" })
                      }
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        setModal({ donation: d, action: "reject" })
                      }
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {modal && (
        <ActionModal
          donation={modal.donation}
          action={modal.action}
          onClose={() => setModal(null)}
          onSuccess={handleActionSuccess}
        />
      )}
    </>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

type Tab = "donations" | "analytics";

export default function AdminDonationsPage() {
  const [tab, setTab] = useState<Tab>("donations");
  const [accessDenied, setAccessDenied] = useState(false);

  // Quick access check — hitting the admin API will return 403 if not admin;
  // but we also rely on the server rendering in dashboard to guard the link.
  useEffect(() => {
    apiClient
      .get("/api/admin/donations?status=pending&page=1&limit=1")
      .catch((err: unknown) => {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setAccessDenied(true);
        }
      });
  }, []);

  if (accessDenied) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <ShieldCheck className="w-16 h-16 text-destructive/40 mx-auto" />
          <p className="text-xl font-semibold text-foreground">Access Denied</p>
          <p className="text-muted-foreground text-sm">
            You must be an admin to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-background">
      {/* Header */}
      <section className="bg-primary py-10">
        <div className="container-custom px-4">
          <h1 className="text-3xl font-serif font-bold text-primary-foreground flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-accent" />
            Admin — Donations
          </h1>
          <p className="text-primary-foreground/70 mt-1 text-sm">
            Review, verify, or reject donation submissions
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="container-custom px-4 py-8">
        <div className="flex gap-1 mb-8 bg-secondary/50 rounded-xl p-1 w-fit">
          {(["donations", "analytics"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-card shadow text-card-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "donations" ? <DonationsTab /> : <AnalyticsTab />}
      </section>
    </div>
  );
}
