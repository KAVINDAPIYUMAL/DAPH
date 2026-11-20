"use client";

import React, { useState } from "react";
import Link from "next/link";

const FARM_CARDS = [
  {
    title: "Farm Data",
    href: "/farm/farmdata",
    image: "/images/farmdata.jpg",
    fallbackImage: "/images/farm.jpg",
  },
  {
    title: "Animal Data",
    href: "/farm/animaldata",
    image: "/images/animaldata.jpg",
    fallbackImage: "/images/inventory.jpg",
  },
  {
    title: "Production Data",
    href: "/farm/milkProduction",
    image: "/images/milkProduction.jpg",
    fallbackImage: "/images/budget.jpg",
  },
  {
    title: "Diseases Data",
    href: "/farm/diseaseconfiguration",
    image: "/images/diseaseconfiguration.jpg",
    fallbackImage: "/images/task.jpg",
  },
  {
    title: "Disaster Data",
    href: "/farm/disasterData",
    image: "/images/disasterData.jpg",
    fallbackImage: "/images/wild.jpg",
  },
  {
    title: "Farm Approval",
    href: "/farm/approval",
    image: "/images/approval.jpg",
    fallbackImage: "/images/task.jpg",
  },
  {
    title: "Collecting Points Configuration",
    href: "/configuration/collectingPoint",
    image: "/images/collectingPoint.jpg",
    fallbackImage: "/images/userconfiguration.jpg",
  },
  {
    title: "Farm Configuration",
    href: "/configuration/farmconfiguration",
    image: "/images/farmconfiguration.jpg",
    fallbackImage: "/images/userconfiguration.jpg",
  },
  {
    title: "Animal Configuration",
    href: "/configuration/animalconfiguration",
    image: "/images/animalconfiguration.jpg",
    fallbackImage: "/images/userconfiguration.jpg",
  },
  {
    title: "Daily Products Configuration",
    href: "/configuration/animalproduction",
    image: "/images/animalproduction.jpg",
    fallbackImage: "/images/userconfiguration.jpg",
  },
  {
    title: "AI Process",
    href: "/farm/ai-process",
    image: "/images/animaldata.jpg",
    fallbackImage: "/images/search.jpg",
  },
  {
    title: "Diseases Process",
    href: "/farm/diseasedata",
    image: "/images/diseasedata.jpg",
    fallbackImage: "/images/task.jpg",
  },
  {
    title: "Disaster Process",
    href: "/farm/disasterProcess",
    image: "/images/disasterProcess.jpg",
    fallbackImage: "/images/wild.jpg",
  },
  {
    title: "Vaccination Process",
    href: "/farm/cowvaccine",
    image: "/images/cowvaccine.jpg",
    fallbackImage: "/images/task.jpg",
  },
  {
    title: "Treatment Process",
    href: "/farm/treatments",
    image: "/images/treatments.jpg",
    fallbackImage: "/images/voucher.jpg",
  },
  {
    title: "Post Mortem Process",
    href: "/farm/treatments",
    image: "/images/treatments.jpg",
    fallbackImage: "/images/voucher.jpg",
  },
  {
    title: "Diseases Configuration",
    href: "/configuration/diseaseConfig",
    image: "/images/diseaseConfig.jpg",
    fallbackImage: "/images/userconfiguration.jpg",
  },
  {
    title: "Disaster Configuration",
    href: "/configuration/disasterConfiguration",
    image: "/images/disasterConfiguration.jpg",
    fallbackImage: "/images/userconfiguration.jpg",
  },
  {
    title: "Drugs Configuration",
    href: "/configuration/animaldrugd",
    image: "/images/animaldrugd.jpg",
    fallbackImage: "/images/userconfiguration.jpg",
  },
  {
    title: "Collecting Companies Configuration",
    href: "/configuration/milkCompanies",
    image: "/images/milkCompanies.jpg",
    fallbackImage: "/images/userconfiguration.jpg",
  },
];

function NavigationCard({ item }) {
  const [imgSrc, setImgSrc] = useState(item.image);

  const handleError = () => {
    if (item.fallbackImage && imgSrc !== item.fallbackImage) {
      setImgSrc(item.fallbackImage);
    } else {
      setImgSrc("/images/farm.jpg");
    }
  };

  return (
    <Link
      href={item.href}
      className="group relative z-0 w-full flex flex-col bg-white shadow-[0_2px_6px_rgba(0,0,0,0.16)] transform-gpu origin-center hover:z-10 hover:scale-[1.04] hover:shadow-[0_14px_26px_rgba(0,0,0,0.35)] transition-all duration-200 border border-black/10 overflow-hidden"
    >
      <div className="w-full h-[86px] sm:h-[92px] md:h-[96px] bg-stone-200 overflow-hidden">
        <img
          src={imgSrc}
          alt={item.title}
          onError={handleError}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full bg-white py-[6px] px-[8px] text-center flex items-center justify-center min-h-[30px]">
        <span className="text-[15px] sm:text-[16px] font-bold text-[#141414] leading-[1.2] tracking-[-0.01em] line-clamp-2">
          {item.title}
        </span>
      </div>
    </Link>
  );
}

export default function FarmNavigationGrid() {
  return (
    <div className="w-full flex justify-center py-[18px] px-[20px] sm:px-[36px] lg:px-[56px]">
      <div className="w-full max-w-[1320px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[32px] gap-y-[28px]">
        {FARM_CARDS.map((card, index) => (
          <NavigationCard key={`${card.title}-${index}`} item={card} />
        ))}
      </div>
    </div>
  );
}