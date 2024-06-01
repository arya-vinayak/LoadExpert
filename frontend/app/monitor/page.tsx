"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/BreadCrumb";
import NodeCard from "@/components/NodeCard";
import { ActiveNode } from "@/types/ActiveNodes";
import Lottie from "lottie-react";
import Empty from "@/public/animations/Empty.json";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LottieComponent from "@/components/lottieComponent";

export default function Page() {
  const [activeNodes, setActiveNodes] = useState<ActiveNode[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/trigger/activeNodes`,
          {
            method: "GET",
            headers: {
              "Cache-Control": "no-store",
              "ngrok-skip-browser-warning": "true",
            },
            redirect: "follow",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setActiveNodes(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (error instanceof Response && error.status === 404) {
          // Display appropriate message on the frontend for 404 error
          // For example:
          // alert("Data not found");
          setActiveNodes([]);
        }
      }
    }

    fetchData();
  }, []);

  return (
    <main>
      <Breadcrumb pageName="Node Monitor" />
      {activeNodes.length === 0 ? (
        <>
          <div className="flex flex-col items-center justify-center gap-3">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] text-center">
              No active Nodes
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base text-center">
              Please Activate Nodes to view them here!
            </p>
            <Link href="/test" passHref>
              <Button type="submit">Activate Nodes</Button>
            </Link>
          </div>
          <LottieComponent />
        </>
      ) : (
        <div className="h-screen gap-8 ml-8 mt-10">
          <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto px-4 py-8">
            {activeNodes.map((node, i) => (
              <NodeCard key={i} activeNode={node} i={i + 1} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
