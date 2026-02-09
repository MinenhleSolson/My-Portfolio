"use client";

import { useState, useEffect } from "react";
import { IoCopyOutline } from "react-icons/io5";

import { cn } from "@/lib/utils";

import { BackgroundGradientAnimation } from "./GradientBg";
import GridGlobe from "./GridGlobe";
import MagicButton from "../MagicButton";

// Safe Lottie wrapper component to avoid unmount issues
const SafeLottie = ({ options, height, width }: { options: any; height: number; width: number }) => {
  const [LottieComponent, setLottieComponent] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    // Dynamic import to avoid SSR issues
    import("react-lottie").then((mod) => {
      if (isMounted) {
        setLottieComponent(() => mod.default);
      }
    });
    
    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!LottieComponent) {
    return <div style={{ width, height }} />;
  }

  return <LottieComponent options={options} height={height} width={width} />;
};

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
  isDarkSection = false,
}: {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
  isDarkSection?: boolean;
}) => {
  const leftLists = ["ReactJS", "Javascript", "Typescript"];
  const rightLists = ["MongoDB", "NextJS", "GraphQL"];

  const [copied, setCopied] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);

  // Load animation data client-side only
  useEffect(() => {
    import("@/data/confetti.json").then((data) => {
      setAnimationData(data.default);
    });
  }, []);

  const defaultOptions = {
    loop: copied,
    autoplay: copied,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCopy = () => {
    const text = "minenhlecele34@gmail.com";
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl border group/bento hover:shadow-xl transition duration-300",
        isDarkSection 
          ? "border-white/10 shadow-lg hover:shadow-purple-light/30 bg-slate-800/60 backdrop-blur-sm"
          : "border-slate-200/50 dark:border-white/[0.1] shadow-lg hover:shadow-purple/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm",
        className
      )}
    >
      {/* add img divs */}
      <div className={`${id === 6 && "flex justify-center"} h-full`}>
        <div className="w-full h-full absolute">
          {img && (
            <img
              src={img}
              alt={img}
              className={cn(imgClassName, "object-cover object-center opacity-80 dark:opacity-100")}
            />
          )}
        </div>
        <div
          className={`absolute right-0 -bottom-5 ${
            id === 5 && "w-full opacity-80"
          } `}
        >
          {spareImg && (
            <img
              src={spareImg}
              alt={spareImg}
              className="object-cover object-center w-full h-full"
            />
          )}
        </div>
        {id === 6 && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
          </BackgroundGradientAnimation>
        )}

        <div
          className={cn(
            titleClassName,
            "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
          {/* Description */}
          <div className={cn(
            "font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm z-10",
            isDarkSection ? "text-slate-300" : "text-slate-500 dark:text-[#C1C2D3]"
          )}>
            {description}
          </div>
          {/* Title */}
          <div
            className={cn(
              "font-sans text-lg lg:text-3xl max-w-96 font-bold z-10",
              isDarkSection ? "text-white" : "text-slate-800 dark:text-white"
            )}
          >
            {title}
          </div>

          {/* for the github 3d globe */}
          {id === 2 && <GridGlobe />}

          {/* Tech stack list div */}
          {id === 3 && (
            <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
              {/* tech stack lists */}
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                {leftLists.map((item, i) => (
                  <span
                    key={i}
                    className={cn(
                      "lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center",
                      isDarkSection ? "bg-slate-700/80 text-white" : "bg-slate-100 dark:bg-[#10132E] text-slate-700 dark:text-white"
                    )}
                  >
                    {item}
                  </span>
                ))}
                <span className={cn(
                  "lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center",
                  isDarkSection ? "bg-slate-700/80" : "bg-slate-100 dark:bg-[#10132E]"
                )}></span>
              </div>
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                <span className={cn(
                  "lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center",
                  isDarkSection ? "bg-slate-700/80" : "bg-slate-100 dark:bg-[#10132E]"
                )}></span>
                {rightLists.map((item, i) => (
                  <span
                    key={i}
                    className={cn(
                      "lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center",
                      isDarkSection ? "bg-slate-700/80 text-white" : "bg-slate-100 dark:bg-[#10132E] text-slate-700 dark:text-white"
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {id === 6 && (
            <div className="mt-5 relative">
              <div
                className={`absolute -bottom-5 right-0 ${
                  copied ? "block" : "block"
                }`}
              >
                {animationData && (
                  <SafeLottie options={defaultOptions} height={200} width={400} />
                )}
              </div>

              <MagicButton
                title={copied ? "Email is Copied!" : "Copy my email address"}
                icon={<IoCopyOutline />}
                position="left"
                handleClick={handleCopy}
                otherClasses={isDarkSection ? "!bg-slate-700" : "!bg-slate-100 dark:!bg-[#161A31]"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
