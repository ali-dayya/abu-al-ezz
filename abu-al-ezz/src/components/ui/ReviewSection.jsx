"use client";
import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

export default function ReviewSection({ productId }) {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadReviews = useCallback(() => {
    setLoading(true);
    apiRequest(`/api/reviews/${productId}`)
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const myReview = reviews.find((r) => r.customer_id === user?.id);
  const avg = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError(lang === "ar" ? "يرجى اختيار تقييم" : "Please select a rating");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await apiRequest(`/api/reviews/${productId}`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      });
      setRating(0);
      setComment("");
      loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await apiRequest(`/api/reviews/${productId}/${reviewId}`, { method: "DELETE" });
      loadReviews();
    } catch {}
  };

  return (
    <div className="mt-16">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={20} style={{ color: "#C9A84C" }} />
        <h2 className="font-display text-2xl font-bold" style={{ color: "#1a1a1a" }}>
          {lang === "ar" ? "التقييمات" : "Reviews"}
        </h2>
        {reviews.length > 0 && (
          <span className="text-sm" style={{ color: "#aaa" }}>
            ({avg.toFixed(1)} / 5 · {reviews.length})
          </span>
        )}
      </div>

      {/* Write review form */}
      {user && !myReview && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-5 mb-8"
          style={{ background: "#fff", border: "1px solid #f0ece4" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C9A84C" }}>
            {lang === "ar" ? "اكتب تقييمك" : "Write a Review"}
          </p>
          <div className="mb-4">
            <StarRating rating={rating} onRate={setRating} size={24} interactive />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={lang === "ar" ? "شاركنا رأيك..." : "Share your experience..."}
            maxLength={1000}
            rows={3}
            className="luxury-input w-full mb-3"
            style={{ resize: "vertical" }}
          />
          {error && <p className="text-sm mb-3" style={{ color: "#ef4444" }}>{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
              color: "#0d0d0d",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting
              ? (lang === "ar" ? "جارٍ الإرسال..." : "Submitting...")
              : (lang === "ar" ? "إرسال التقييم" : "Submit Review")}
          </button>
        </form>
      )}

      {!user && (
        <p className="text-sm mb-6" style={{ color: "#aaa" }}>
          {lang === "ar" ? "سجل دخولك لكتابة تقييم" : "Log in to write a review"}
        </p>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-24 mb-3" />
              <div className="skeleton h-3 w-full" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare size={40} className="mx-auto mb-3" style={{ color: "#e5dfc8" }} />
          <p className="text-sm" style={{ color: "#aaa" }}>
            {lang === "ar" ? "لا توجد تقييمات بعد" : "No reviews yet. Be the first!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.review_id}
              className="rounded-2xl p-5"
              style={{ background: "#fff", border: "1px solid #f0ece4" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}
                  >
                    {review.customer_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                      {review.customer_name}
                    </p>
                    <p className="text-xs" style={{ color: "#aaa" }}>
                      {new Date(review.created_at).toLocaleDateString(lang === "ar" ? "ar" : "en-US")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} size={14} />
                  {user && review.customer_id === user.id && (
                    <button
                      onClick={() => handleDelete(review.review_id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: "#aaa" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#aaa"; }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "#515151" }}>
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
