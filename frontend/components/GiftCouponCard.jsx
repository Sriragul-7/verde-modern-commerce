import { TicketPercent } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const { coupon, appliedCoupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } =
    useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  const displayedCode = !userInputCode && coupon?.code && !isCouponApplied ? coupon.code : userInputCode;
  const codeToApply = displayedCode.trim();

  return (
    <section className="glass-panel space-y-5 rounded-[1.75rem] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-emerald-300/10 p-3 text-emerald-200">
          <TicketPercent className="size-5" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/65">Discounts</p>
          <h3 className="mt-2 text-2xl text-white">Voucher or gift card</h3>
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-slate-200/80">Enter code</span>
        <input
          type="text"
          className="w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400"
          placeholder="Enter code here"
          value={displayedCode}
          onChange={(event) => setUserInputCode(event.target.value)}
        />
      </label>

      <button
        type="button"
        className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white transition hover:bg-white/10"
        disabled={!codeToApply}
        onClick={() => codeToApply && applyCoupon(codeToApply)}
      >
        Apply code
      </button>

      {isCouponApplied && appliedCoupon && (
        <div className="rounded-[1.25rem] border border-emerald-200/20 bg-emerald-300/10 p-4">
          <p className="text-sm text-emerald-100">Applied coupon</p>
          <p className="mt-2 text-white">
            {appliedCoupon.code} - {appliedCoupon.discountPercentage}% off
          </p>
          <button
            type="button"
            className="mt-3 text-sm text-rose-300 hover:text-rose-200"
            onClick={() => {
              setUserInputCode("");
              removeCoupon();
            }}
          >
            Remove coupon
          </button>
        </div>
      )}

      {coupon && !isCouponApplied && (
        <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200/85">
          Available coupon: {coupon.code} - {coupon.discountPercentage}% off
        </div>
      )}
      </section>
  );
};

export default GiftCouponCard;
