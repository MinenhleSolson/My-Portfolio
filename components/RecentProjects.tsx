"use client";

import { FaLocationArrow } from "react-icons/fa6";
import { motion } from "framer-motion";

import { projects as staticProjects } from "@/data";
import { useProjects } from "@/hooks/useFirestoreData";
import Link from "next/link";
import { PinContainer } from "./ui/Pin";

const RecentProjects = () => {
  const { data: firebaseProjects, loading } = useProjects();
  
  // Use Firebase data if available, otherwise fall back to static data
  const projects = firebaseProjects.length > 0 ? firebaseProjects : staticProjects;

  return (
    <div className="py-20">
      <motion.h1 
        id="projects" 
        className="heading text-slate-800 dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        A Small Selection of{" "}
        <span className="text-purple dark:text-purple-light">Recent Projects</span>
      </motion.h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
        {projects.map((item: any, idx: number) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw]"
            key={item.id}
          >
            <Link href={item.link} target="_blank">
              <PinContainer href={item.link}>
                <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                  <div
                    className="relative w-full h-full overflow-hidden lg:rounded-3xl bg-slate-100 dark:bg-[#13162D]"
                  >
                    <img src="/bg.png" alt="bgimg" className="opacity-50 dark:opacity-100" />
                  </div>
                  <img
                    src={item.img}
                    alt="cover"
                    className="z-10 absolute bottom-0"
                  />
                </div>

                <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1 text-slate-800 dark:text-white">
                  {item.title}
                </h1>

                <p
                  className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2 text-slate-500 dark:text-[#BEC1DD]"
                  style={{
                    margin: "1vh 0",
                  }}
                >
                  {item.des}
                </p>

                <div className="flex items-center justify-between mt-7 mb-3">
                  <div className="flex items-center">
                    {item.iconLists?.map((icon: string, index: number) => (
                      <div
                        key={index}
                        className="border border-slate-200 dark:border-white/[.2] rounded-full bg-white dark:bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                        style={{
                          transform: `translateX(-${5 * index + 2}px)`,
                        }}
                      >
                        <img src={icon} alt="icon5" className="p-2" />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center items-center">
                    <p className="flex lg:text-xl md:text-xs text-sm text-purple dark:text-purple-light">
                      Check Live Site
                    </p>
                    <FaLocationArrow className="ms-3" color="#8B5CF6" />
                  </div>
                </div>
              </PinContainer>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;

