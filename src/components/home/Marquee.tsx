"use client";

export function Marquee() {
  const items = [
    "New Arrivals", "Free Shipping above ₹2,999", "Easy Returns",
    "Ethnic Wear", "Western Wear", "Premium Quality", "Zaaforia Exclusive",
    "New Arrivals", "Free Shipping above ₹2,999", "Easy Returns",
    "Ethnic Wear", "Western Wear", "Premium Quality", "Zaaforia Exclusive",
  ];

  return (
    <div className="overflow-hidden bg-[#F5EBE0] py-3 border-y border-[#E8E8E8]">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center mx-8 text-sm font-poppins font-600 text-[#1A1A1A] uppercase tracking-[0.18em]">
            {item}
            <span className="mx-8 text-[#C4973A]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
