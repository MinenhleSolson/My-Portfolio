"use client";

import { gridItems as staticGridItems } from "@/data";
import { useSiteSettings } from "@/hooks/useSupabaseData";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";

const Grid = () => {
  const { data: siteSettings, loading } = useSiteSettings();
  
  // Use Supabase data if available, otherwise fall back to static data.
  const gridItems = siteSettings?.gridItems && siteSettings.gridItems.length > 0 
    ? siteSettings.gridItems 
    : staticGridItems;

  return (
    <section id="about" className="w-full">
      {/* Dark themed full-width container for the About/Grid section */}
      <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 lg:py-20 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <BentoGrid className="w-full">
          {gridItems.map((item: any, i: number) => (
            <BentoGridItem
              id={item.id}
              key={i}
              title={item.title}
              description={item.description}
              className={item.className}
              img={item.img}
              imgClassName={item.imgClassName}
              titleClassName={item.titleClassName}
              spareImg={item.spareImg}
              isDarkSection={true}
            />
          ))}
          </BentoGrid>
        </div>
      </div>
    </section>
  );
};

export default Grid;
