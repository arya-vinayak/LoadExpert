"use client"; // This is a client component

import Lottie from "lottie-react";
import Empty from "@/public/animations/Empty.json";

export default function LottieComponent() {
  return <Lottie animationData={Empty} />;
}
