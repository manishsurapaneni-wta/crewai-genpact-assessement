"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecruitmentAnalysis } from "@/components/recruitment-analysis"
import { IdempotentActionTrigger } from "@/components/idempotent-action-trigger"
import { FlowTraceGenerator } from "@/components/flow-trace-generator"
import { MetricsDashboard } from "@/components/metrics-dashboard"
import { FallbackExecutionVisualizer } from "@/components/fallback-execution-visualizer"
import { HumanInTheLoopWorkflow } from "@/components/human-in-the-loop-workflow"
import { CrewConfigurationManager } from "@/components/crew-configuration-manager"
import { SecureToolTrigger } from "@/components/secure-tool-trigger"
import { CachingPerformanceComparison } from "@/components/caching-performance-comparison"
import { ConceptualDiagramDisplay } from "@/components/conceptual-diagram-display"
import Image from "next/image"

export function TabbedInterface() {
  const [activeTab, setActiveTab] = useState("step1")

  return (
    <div className="w-full max-w-4xl">
      <div className="flex items-center mb-8 gap-4">
        <Image src="/images/logo.jpeg" alt="Company Logo" width={60} height={60} className="rounded-md" />
        <h1 className="text-3xl font-bold">Recruitment Crew Platform</h1>
      </div>

      <Tabs defaultValue="step1" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="step1">Step 1</TabsTrigger>
          <TabsTrigger value="step2">Step 2</TabsTrigger>
          <TabsTrigger value="step3">Step 3</TabsTrigger>
          <TabsTrigger value="step4">Step 4</TabsTrigger>
          <TabsTrigger value="step5">Step 5</TabsTrigger>
          <TabsTrigger value="step6">Step 6</TabsTrigger>
          <TabsTrigger value="step7">Step 7</TabsTrigger>
          <TabsTrigger value="step8">Step 8</TabsTrigger>
          <TabsTrigger value="step9">Step 9</TabsTrigger>
          <TabsTrigger value="step10">Step 10</TabsTrigger>
        </TabsList>
        <TabsContent value="step1" className="mt-6">
          <RecruitmentAnalysis />
        </TabsContent>
        <TabsContent value="step2" className="mt-6">
          <IdempotentActionTrigger
            title="Send Onboarding Email to New Hire"
            description="This will send a welcome email with onboarding instructions to the new team member."
            actionId="new-hire-email-123"
          />
        </TabsContent>
        <TabsContent value="step3" className="mt-6">
          <FlowTraceGenerator
            title="Run Detailed Candidate Screening Process"
            description="This will execute a comprehensive candidate screening workflow and generate a trace for debugging and monitoring."
          />
        </TabsContent>
        <TabsContent value="step4" className="mt-6">
          <MetricsDashboard />
        </TabsContent>
        <TabsContent value="step5" className="mt-6">
          <FallbackExecutionVisualizer
            title="Advanced Profile Enrichment"
            description="Attempts to enrich candidate profiles with advanced data sources. Falls back to basic enrichment if advanced sources are unavailable."
          />
        </TabsContent>
        <TabsContent value="step6" className="mt-6">
          <HumanInTheLoopWorkflow
            title="Candidate Evaluation Workflow"
            description="This workflow analyzes candidate data and requires human review before proceeding to the final recommendation."
          />
        </TabsContent>
        <TabsContent value="step7" className="mt-6">
          <CrewConfigurationManager
            title="Crew Configuration Manager"
            description="Customize your recruitment crew by adding, removing, or reordering agents to optimize your hiring workflow."
          />
        </TabsContent>
        <TabsContent value="step8" className="mt-6">
          <SecureToolTrigger
            title="Competitor Analysis Tool"
            description="Analyze competitor hiring data using securely stored API credentials. All sensitive information is handled securely on the server."
          />
        </TabsContent>
        <TabsContent value="step9" className="mt-6">
          <CachingPerformanceComparison
            title="Caching Performance Comparison"
            description="Compare the performance of LLM processing with and without caching to see the speed improvements."
          />
        </TabsContent>
        <TabsContent value="step10" className="mt-6">
          <ConceptualDiagramDisplay
            title="Architecture Concepts"
            description="Visual explanations of key architectural concepts used in the Recruitment Crew platform."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
