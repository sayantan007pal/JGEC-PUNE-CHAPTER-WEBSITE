"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import apiClient from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Types & helpers ─────────────────────────────────────────────────────────

const STATUSES = [
  "all",
  "initiated",
  "pending",
  "verified",
  "rejected",
] as const;
type StatusFilter = (typeof STATUSES)[number];

const CATEGORY_LABELS: Record<string, string> = {
  scholarship: "Scholarships",
  infrastructure: "Infrastructure",
  innovation: "Innovation",
  alumni_activities: "Alumni Activities",
  general: "General",
};

interface Donation {
  _id: string;
  amount: number;
  donationCategory: string;
  paymentRequestRef: string;
  status: string;
  utr?: string;
  proofSubmittedAt?: string;
  verificationDate?: string;
  donorMessage?: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    initiated: {
      label: "Initiated",
      className: "bg-secondary text-muted-foreground",
      icon: <Clock className="w-3 h-3" />,
    },
    pending: {
      label: "Pending",
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      icon: <Clock className="w-3 h-3" />,
    },
    verified: {
      label: "Verified",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: <XCircle className="w-3 h-3" />,
    },
  };
  const cfg = map[status] ?? {
    label: status,
    className: "bg-secondary text-muted-foreground",
    icon: null,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.className}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function fmt(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MyDonationsPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await apiClient.get<{
        donations: Donation[];
        total: number;
        totalPages: number;
      }>(`/api/donations/my-donations?status=${filter}&page=${page}&limit=10`);
      setDonations(data.donations);
      setTotal(data.total);
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
  }, [filter, page]);

  useEffect(() => {
    void fetchDonations();
  }, [fetchDonations]);

  const handleFilterChange = (f: StatusFilter) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <div className="min-h-[80vh] bg-background">
      {/* Header */}
      <section className="bg-primary py-10">
        <div className="container-custom px-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-serif font-bold text-primary-foreground flex items-center gap-3">
            <Heart className="w-8 h-8 text-accent" />
            My Donations
          </h1>
          <p className="text-primary-foreground/70 mt-1 text-sm">
            {total} donation{total !== 1 ? "s" : ""} total
          </p>
        </div>
      </section>

      <section className="container-custom px-4 py-8">
        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleFilterChange(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                filter === s
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-accent/10"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm">
            {error}
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">
              No {filter !== "all" ? filter : ""} donations found.
            </p>
            <Link href="/donate">
              <Button variant="outline" className="mt-4">
                Make a Donation
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {donations.map((d) => (
                <div
                  key={d._id}
                  className="bg-card rounded-xl p-5 card-shadow flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Amount + category */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xl font-serif font-bold text-card-foreground">
                        ₹{d.amount.toLocaleString("en-IN")}
                      </span>
                      <StatusBadge status={d.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {CATEGORY_LABELS[d.donationCategory] ??
                        d.donationCategory}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono break-all">
                      Ref: {d.paymentRequestRef}
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="text-right text-xs text-muted-foreground space-y-0.5 flex-shrink-0">
                    <p>Initiated: {fmt(d.createdAt)}</p>
                    {d.proofSubmittedAt && (
                      <p>Proof: {fmt(d.proofSubmittedAt)}</p>
                    )}
                    {d.verificationDate && (
                      <p>Verified: {fmt(d.verificationDate)}</p>
                    )}
                    {d.utr && <p className="font-mono">UTR: {d.utr}</p>}
                  </div>
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
      </section>
    </div>
  );
}
