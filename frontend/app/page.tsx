"use client"; // Ensure this file is treated as a client-side module

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Lottie from "lottie-react";
import LoadAnimation from "@/public/animations/LoadAnimation.json"


export default function Home() {
  return (
    <main>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Master Load Testing with Our Comprehensive Solution
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Enhance your server performance and reliability with our
                  state-of-the-art load testing platform. Seamlessly
                  orchestrate, monitor, and visualize your load tests, and
                  ensure optimal server health with our robust and scalable
                  solution.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link href="/test" passHref>
                  <Button type="submit">Get Started</Button>
                </Link>
              </div>
            </div>
            <Lottie animationData={LoadAnimation} />
            {/* Lottie component uses UseState under the hood */}
          </div>
        </div>
      </section>
    </main>
  );
}
