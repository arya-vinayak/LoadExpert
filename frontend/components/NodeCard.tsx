"use client";
import { useState, useEffect } from "react";
import {
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogTrigger, DialogContent, Dialog } from "@/components/ui/dialog";
import { ActiveNode } from "@/types/ActiveNodes";
import { getRelativeTime } from "@/utils/timeFormatting";

//defining nodecard props
interface NodeCardProps {
    activeNode:ActiveNode;
    i:number;
}


function useRelativeTime(timestamp: string) {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(timestamp));
    }, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return relativeTime;
}


export default function NodeCard({ activeNode,i }: NodeCardProps) {
    const relativeTime = useRelativeTime(activeNode.timestamp);
  return (
    <Card
      key="1"
      className="w-full max-w-sm border-[1px] border-gray-300 dark:border-gray-700 rounded-3xl"
    >
      <CardHeader className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <ServerIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Node {i}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last active {relativeTime} 
          </div>
          {activeNode.alive ? (
            <div className="aspect-square w-3 h-3 rounded-full bg-green-500" />
          ) : (
            <div className="aspect-square w-3 h-3 rounded-full bg-red-500" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {activeNode.alive ? (
          <div className="text-base font-medium text-gray-500 dark:text-gray-400">
            This node is currently online and processing requests.
          </div>
        ) : (
          <div className="text-base font-medium text-gray-500 dark:text-gray-400">
            This node is currently offline and not processing requests.
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <div className="text-base font-medium text-gray-500 dark:text-gray-400">
              Uptime: 12 days
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CpuIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <div className="text-base font-medium text-gray-500 dark:text-gray-400">
              CPU: 75%
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NetworkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <div className="text-base font-medium text-gray-500 dark:text-gray-400">
              IP Address: {activeNode.ipAddress}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="bg-gray-900 text-gray-50 hover:bg-gray-800 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-gray-300 rounded-3xl"
              size="sm"
              variant="outline"
            >
              View Logs
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <Card className="w-full border-[1px] border-gray-300 dark:border-gray-700 rounded-3xl">
              <CardHeader>
                <CardTitle>Node {i} Logs</CardTitle>
                <CardDescription>
                  Detailed log history for the past 30 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-gray-100 p-4 rounded-3xl dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Error
                      </div>
                      <div className="text-sm font-medium text-red-500">12</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-2">
                      120
                    </div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-3xl dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Warning
                      </div>
                      <div className="text-sm font-medium text-yellow-500">
                        24
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-2">
                      240
                    </div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-3xl dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Info
                      </div>
                      <div className="text-sm font-medium text-blue-500">
                        48
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-2">
                      480
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <th className="py-3 pr-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          Timestamp
                        </th>
                        <th className="py-3 pr-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          Level
                        </th>
                        <th className="py-3 pr-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          Message
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <td className="py-3 pr-4 text-gray-900 dark:text-gray-50 whitespace-nowrap">
                          2023-05-29 12:34:56
                        </td>
                        <td className="py-3 pr-4 text-red-500 whitespace-nowrap">
                          Error
                        </td>
                        <td className="py-3 pr-4 text-gray-900 dark:text-gray-50">
                          Failed to connect to database
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <td className="py-3 pr-4 text-gray-900 dark:text-gray-50 whitespace-nowrap">
                          2023-05-29 12:35:01
                        </td>
                        <td className="py-3 pr-4 text-yellow-500 whitespace-nowrap">
                          Warning
                        </td>
                        <td className="py-3 pr-4 text-gray-900 dark:text-gray-50">
                          High CPU usage detected
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <td className="py-3 pr-4 text-gray-900 dark:text-gray-50 whitespace-nowrap">
                          2023-05-29 12:35:10
                        </td>
                        <td className="py-3 pr-4 text-blue-500 whitespace-nowrap">
                          Info
                        </td>
                        <td className="py-3 pr-4 text-gray-900 dark:text-gray-50">
                          Node started successfully
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
        <Button
          className="bg-gray-900 text-gray-50 hover:bg-gray-800 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-gray-300 rounded-3xl"
          size="sm"
          variant="secondary"
        >
          Restart Node
        </Button>
      </CardFooter>
    </Card>
  );
}

function ClockIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CpuIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  );
}

function ServerIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  );
}


function NetworkIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </svg>
  );
}