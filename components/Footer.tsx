"use client";

import { FaLocationArrow } from "react-icons/fa6";
import { motion } from "framer-motion";

import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full relative" id="contact">
      {/* Dark themed full-width container for Footer section */}
      <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 lg:py-16 pb-10 px-5 sm:px-10">

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center relative z-10">
            <motion.h1 
              className="heading lg:max-w-[45vw] text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Take <span className="text-purple-light">Your</span> Digital
              Presence to The Next Level?
            </motion.h1>
            <motion.p 
              className="text-slate-300 md:mt-10 my-5 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Reach out to me today and let&apos;s discuss how I can help you
              achieve your goals.
            </motion.p>
            <motion.a 
              href="mailto:minenhlecele34@gmail.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <MagicButton
                title="Let's get in touch"
                icon={<FaLocationArrow />}
                position="right"
              />
            </motion.a>
          </div>
          
          <div className="flex mt-16 md:flex-row flex-col justify-between items-center relative z-10">
            <p className="md:text-base text-sm md:font-normal font-light text-slate-400">
              &copy; {new Date().getFullYear()} Minenhle Cele
            </p>

            <div className="flex items-center md:gap-3 gap-6 mt-4 md:mt-0">
              {socialMedia.map((info) => (
                <motion.div
                  key={info.id}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-slate-700/80 rounded-lg border border-white/10 shadow-sm hover:shadow-md hover:shadow-purple-light/20 transition-shadow"
                >
                  <Link href={info.link} target="_blank">
                    <img src={info.img} alt="icons" width={20} height={20} className="opacity-80 hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

