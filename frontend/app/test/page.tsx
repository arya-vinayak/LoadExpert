"use client";
import { useState, useEffect } from "react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/BreadCrumb";
import { useToast } from "@/components/ui/use-toast";
import loadingAnimation from "@/public/animations/loading.json";
import Lottie from "lottie-react";
import { ActiveNode } from "@/types/ActiveNodes";

interface TestMetric {
  nodeIP: string;
  testId: string;
  metrics: {
    meanLatency: number;
    medianLatency: number;
    minLatency: number;
    maxLatency: number;
  };
}

export default function TestBed() {
  const [testServer, setTestServer] = useState("");
  const [testType, setTestType] = useState("");
  const [testerNodes, setTesterNodes] = useState(0);
  const [numRequests, setNumRequests] = useState(0);
  const [requestDelay, setRequestDelay] = useState(0);
  const [activeNodes, setActiveNodes] = useState(0);
  const [testResults, setTestResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testMetrics, setTestMetrics] = useState<TestMetric[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function loadActiveNodes() {
      try {
        let activeNodes: ActiveNode[] = [];
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/trigger/activeNodes`,
          {
            method: "GET",
            redirect: "follow",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const activeNode = await res.json();
        // setActiveNodes(nodes.length);
        //computing the length of the active nodes by filtering the nodes with status as active
        activeNodes = activeNode.filter(
          (node: ActiveNode) => node.alive === true
        );
        setActiveNodes(activeNodes.length);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setActiveNodes(0); // Set to 0 in case of error
      }
    }

    loadActiveNodes();
  }, []);

  const handleActivation = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("ngrok-skip-browser-warning", "true")

    const raw = JSON.stringify({
      desiredTesterNodeCount: testerNodes,
    });

    console.log(raw);

    try {
      // Sending the PUT request
      const putResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/trigger/desiredCount`,
        {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        }
      );

      const putResult = await putResponse.text();

      console.log("PUT request result:", putResult);

      toast({
        title: "Activation in progress",
        description:
          "This can take a few minutes after which you can start monitoring with the monitor button.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.error(error);
    }
  };

  const startHeartbeat = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/trigger/start`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-store",
          "ngrok-skip-browser-warning": "true",
        },
        redirect: "follow",

      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      toast({
        title: "Monitoring started",
        description: "You can now monitor the active nodes.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.error(error);
    }
  };

  const deactivateNodes = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("ngrok-skip-browser-warning", "true");

    const raw = JSON.stringify({
      desiredTesterNodeCount: 0,
    });

    try {
      // Sending the PUT request
      const putResponse = fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/trigger/desiredCount`,
        {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        }
      );

      // Sending the GET request
      const getResponse = fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/trigger/stop`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-store",
          "ngrok-skip-browser-warning": "true",
        },
        redirect: "follow",
      });

      // Waiting for both requests to complete
      const [putResult, getResult] = await Promise.all([
        putResponse.then((response) => response.text()),
        getResponse.then((response) => response.text()),
      ]);

      console.log("PUT request result:", putResult);
      console.log("GET request result:", getResult);

      toast({
        title: "Deactivation in progress",
        description: "This can take a few minutes. Please click on Stop ",
      });
      setActiveNodes(0);

      toast({
        title: "Monitoring stopped",
        description: "You can now stop monitoring the active nodes.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.error(error);
    }
  };

  const handleTestClick = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("ngrok-skip-browser-warning", "true");

    const raw = JSON.stringify({
      testId: Math.floor(Math.random() * 1000) + 1,
      testType: testType.toUpperCase(),
      test_message_delay: requestDelay,
      message_count_per_driver: numRequests,
      target_server: testServer,
    });

    if (numRequests <= 0 || requestDelay <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description:
          "Message count per driver and delay must be greater than 0.",
      });
      return;
    }

    try {
      console.log(raw);
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/trigger/runTest`,
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        }
      );

      toast({
        title: "Test initiated",
        description: "Kindly wait for the results.",
      });

      const requestedMetrics = await response.json();
      console.log(requestedMetrics);
      setTestMetrics((prevMetrics) => [...prevMetrics, ...requestedMetrics]);
      setTestResults(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Unable to initiate Test. Please try again.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Breadcrumb pageName="Test Bed Setup" />
      <div className="flex flex-col items-center justify-start min-h-screen gap-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-950 shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Tester Nodes</CardTitle>
              <CardDescription className="text-lg font-medium">
                Configure the number of tester nodes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 items-center">
                <div className="grid gap-3 ">
                  <Label className="text-lg font-medium" htmlFor="tester-nodes">
                    Tester Nodes
                  </Label>
                  <Input
                    className="text-lg"
                    id="tester-nodes"
                    max="10"
                    min="0"
                    type="number"
                    value={testerNodes}
                    onChange={(e) => setTesterNodes(parseInt(e.target.value))}
                  />
                </div>
                <div className="flex justify-end col-2 gap-2  justify-center">
                  <Button
                    onClick={handleActivation}
                    className="bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 px-8 py-2 text-lg font-bold"
                  >
                    Activate
                  </Button>
                  <Button
                    onClick={deactivateNodes}
                    className="bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 px-8 py-2 text-lg font-bold"
                  >
                    Deactivate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-950 shadow-lg rounded-2xl p-6">
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-gray-500 dark:text-gray-400 text-base font-medium mb-4">
                Current Node Count
              </div>
              <div className="text-6xl font-bold text-gray-900 dark:text-gray-50 mb-4">
                {activeNodes}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-base text-center">
                The node count represents the number of tester nodes currently
                active which is proofed with underlying heartbeat mechanism.
              </p>
              <div className="flex justify-center mt-4 col-2 gap-2">
                <Button
                  onClick={startHeartbeat}
                  className="bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 px-8 py-2 text-lg font-bold"
                >
                  Monitor
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-950 shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Test Configurations
              </CardTitle>
              <CardDescription className="text-lg font-medium">
                Configure your test settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label className="text-lg font-medium" htmlFor="test-server">
                    Test Server
                  </Label>
                  <Input
                    className="text-lg"
                    id="test-server"
                    placeholder="Enter your test server"
                    value={testServer}
                    onChange={(e) => setTestServer(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label className="text-lg font-medium" htmlFor="test-type">
                    Test Type
                  </Label>
                  <Select value={testType} onValueChange={setTestType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tsunami">Tsunami</SelectItem>
                      <SelectItem value="avalanche">Avalanche</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label className="text-lg font-medium" htmlFor="num-requests">
                    Number of Requests
                  </Label>
                  <Input
                    className="text-lg"
                    id="num-requests"
                    min="0"
                    type="number"
                    value={numRequests}
                    onChange={(e) => setNumRequests(parseInt(e.target.value))}
                  />
                </div>
                <div className="grid gap-3 ">
                  <Label
                    className="text-lg font-medium"
                    htmlFor="request-delay"
                  >
                    Request Delay (ms)
                  </Label>
                  <Input
                    className="text-lg"
                    id="request-delay"
                    min="0"
                    type="number"
                    value={requestDelay}
                    onChange={(e) => setRequestDelay(parseInt(e.target.value))}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    className="bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 px-8 py-2 text-lg font-bold"
                    onClick={handleTestClick}
                  >
                    Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="w-full max-w-4xl mx-auto">
            <Card className="bg-gray-100 dark:bg-gray-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                  Test Metrics
                </CardTitle>
                <CardDescription className="text-xl font-medium text-gray-600 dark:text-gray-400">
                  View test results for your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testResults ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testMetrics.map((metric, index) => (
                      <Card
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between"
                      >
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <ServerIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                              <div>
                                <div className="text-lg font-medium text-gray-900 dark:text-gray-50">
                                  Node IP
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {metric.nodeIP}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <HashIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                              <div>
                                <div className="text-lg font-medium text-gray-900 dark:text-gray-50">
                                  Test ID: {metric.testId}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <GaugeIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                              <div>
                                <div className="text-lg font-medium text-gray-900 dark:text-gray-50">
                                  Mean Latency
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {metric.metrics.meanLatency.toFixed(2)} ms
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <GaugeIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                              <div>
                                <div className="text-lg font-medium text-gray-900 dark:text-gray-50">
                                  Median Latency
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {metric.metrics.medianLatency.toFixed(2)} ms
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <GaugeIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                              <div>
                                <div className="text-lg font-medium text-gray-900 dark:text-gray-50">
                                  Min Latency
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {metric.metrics.minLatency.toFixed(2)} ms
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <GaugeIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                              <div>
                                <div className="text-lg font-medium text-gray-900 dark:text-gray-50">
                                  Max Latency
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {metric.metrics.maxLatency.toFixed(2)} ms
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <>
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <Lottie animationData={loadingAnimation} />
                      </div>
                    ) : (
                      <h1>No Tests Yet</h1>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function GaugeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}

function HashIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  );
}

function ServerIcon(props: React.SVGProps<SVGSVGElement>) {
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
