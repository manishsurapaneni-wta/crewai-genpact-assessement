"use client"

import React, { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Workflow,
  Database,
  Network,
  Layers,
  ZoomIn,
  ZoomOut,
  X,
  Info,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock diagram data with hotspots
const diagrams = [
  {
    id: "distributed-processing",
    title: "Distributed Processing",
    description:
      "The Recruitment Crew platform uses a distributed processing architecture to handle large volumes of candidate data efficiently.",
    icon: Network,
    image: "/distributed-system-overview.png",
    codeSnippet: `// Example of distributed task processing
import { Queue } from '@recruitment/queue';

// Create processing queues for different regions
const usQueue = new Queue('candidate-processing-us');
const euQueue = new Queue('candidate-processing-eu');
const asiaQueue = new Queue('candidate-processing-asia');

export async function distributeProcessing(candidateData) {
  // Determine which queue to use based on candidate location
  const region = determineRegion(candidateData.location);
  
  let queue;
  switch (region) {
    case 'US':
      queue = usQueue;
      break;
    case 'EU':
      queue = euQueue;
      break;
    case 'ASIA':
      queue = asiaQueue;
      break;
    default:
      queue = usQueue; // Default to US queue
  }
  
  // Add task to the appropriate queue
  await queue.add('process-candidate', {
    candidateId: candidateData.id,
    priority: candidateData.priority,
    timestamp: Date.now()
  });
  
  return { status: 'queued', region };
}`,
    hotspots: [
      {
        id: "hs-1",
        x: 20,
        y: 30,
        title: "Load Balancer",
        description: "Distributes incoming requests across multiple processing nodes based on region and load.",
      },
      {
        id: "hs-2",
        x: 50,
        y: 60,
        title: "Regional Processing Queues",
        description: "Separate queues for different geographic regions to optimize processing based on locality.",
      },
      {
        id: "hs-3",
        x: 80,
        y: 40,
        title: "Worker Nodes",
        description: "Scalable processing nodes that handle the actual candidate data analysis.",
      },
    ],
  },
  {
    id: "multi-tenancy",
    title: "Multi-Tenancy Architecture",
    description:
      "Our platform supports multiple organizations with isolated data and customizable workflows while sharing the same infrastructure.",
    icon: Layers,
    image: "/multi-tenant-separate-data-shared-services.png",
    codeSnippet: `// Multi-tenancy implementation with data isolation
import { getTenantContext } from '@recruitment/tenant-context';
import { Database } from '@recruitment/database';

export class TenantAwareRepository {
  constructor(private entityType: string) {}
  
  async findById(id: string) {
    const tenantId = getTenantContext().tenantId;
    
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    
    const db = await Database.connect();
    
    // Query always includes tenant filter for data isolation
    return db.collection(this.entityType).findOne({
      _id: id,
      tenantId: tenantId
    });
  }
  
  async create(data: any) {
    const tenantId = getTenantContext().tenantId;
    
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    
    // Always inject tenant ID into all records
    const enrichedData = {
      ...data,
      tenantId,
      createdAt: new Date()
    };
    
    const db = await Database.connect();
    return db.collection(this.entityType).insertOne(enrichedData);
  }
}`,
    hotspots: [
      {
        id: "hs-1",
        x: 25,
        y: 20,
        title: "Tenant Identification",
        description: "Authentication layer that identifies the tenant from the request.",
      },
      {
        id: "hs-2",
        x: 50,
        y: 50,
        title: "Isolated Data Storage",
        description: "Each tenant's data is logically separated with tenant ID filtering on all queries.",
      },
      {
        id: "hs-3",
        x: 75,
        y: 30,
        title: "Shared Services",
        description: "Common services like analytics and reporting that operate across tenants.",
      },
    ],
  },
  {
    id: "async-workflow",
    title: "Asynchronous Workflow",
    description:
      "Recruitment processes are handled asynchronously to improve responsiveness and allow for long-running operations.",
    icon: Workflow,
    image: "/asynchronous-workflow.png",
    codeSnippet: `// Asynchronous workflow implementation
import { EventBus } from '@recruitment/events';
import { WorkflowEngine } from '@recruitment/workflow';

// Define the workflow steps
const candidateScreeningWorkflow = new WorkflowEngine()
  .addStep('parse-resume', {
    handler: parseResumeHandler,
    timeout: '30s',
    retries: 3
  })
  .addStep('extract-skills', {
    handler: extractSkillsHandler,
    timeout: '1m',
    retries: 2,
    requiresPrevious: true
  })
  .addStep('match-jobs', {
    handler: matchJobsHandler,
    timeout: '2m',
    retries: 2,
    requiresPrevious: true
  })
  .addStep('generate-report', {
    handler: generateReportHandler,
    timeout: '1m',
    requiresPrevious: true
  });

// Start the workflow asynchronously
export async function startCandidateScreening(candidateId) {
  // Initialize the workflow context
  const workflowId = await candidateScreeningWorkflow.start({
    candidateId,
    startedAt: new Date()
  });
  
  // Publish event for tracking
  await EventBus.publish('candidate.screening.started', {
    candidateId,
    workflowId,
    timestamp: Date.now()
  });
  
  return { workflowId };
}`,
    hotspots: [
      {
        id: "hs-1",
        x: 15,
        y: 40,
        title: "Event Triggers",
        description: "Events that initiate workflow steps, allowing decoupled processing.",
      },
      {
        id: "hs-2",
        x: 50,
        y: 30,
        title: "Workflow Engine",
        description: "Orchestrates the execution of workflow steps and handles retries and timeouts.",
      },
      {
        id: "hs-3",
        x: 85,
        y: 60,
        title: "State Storage",
        description: "Persistent storage of workflow state to enable resumability and fault tolerance.",
      },
    ],
  },
  {
    id: "caching-strategy",
    title: "Caching Strategy",
    description:
      "Our platform implements a multi-level caching strategy to improve performance and reduce costs of LLM operations.",
    icon: Database,
    image: "/multi-level-cache-architecture.png",
    codeSnippet: `// Multi-level caching implementation for LLM operations
import { createClient } from 'redis';
import { LLMProvider } from '@recruitment/llm';
import { createHash } from 'crypto';

// Initialize cache clients
const localCache = new Map();
const redisClient = createClient({ url: process.env.REDIS_URL });

export class CachedLLMProcessor {
  constructor(private llmProvider: LLMProvider) {}
  
  async processText(prompt: string, options: any = {}) {
    // Generate cache key based on prompt and options
    const cacheKey = this.generateCacheKey(prompt, options);
    
    // Try local memory cache first (fastest)
    if (localCache.has(cacheKey)) {
      return {
        result: localCache.get(cacheKey),
        source: 'local-cache'
      };
    }
    
    try {
      // Try Redis cache next
      await redisClient.connect();
      const cachedResult = await redisClient.get(cacheKey);
      
      if (cachedResult) {
        // Update local cache
        localCache.set(cacheKey, JSON.parse(cachedResult));
        
        return {
          result: JSON.parse(cachedResult),
          source: 'redis-cache'
        };
      }
      
      // Cache miss - call the LLM
      const result = await this.llmProvider.complete(prompt, options);
      
      // Update both caches
      localCache.set(cacheKey, result);
      await redisClient.set(cacheKey, JSON.stringify(result), {
        EX: 3600 // Cache for 1 hour
      });
      
      return {
        result,
        source: 'llm'
      };
    } finally {
      await redisClient.disconnect();
    }
  }
  
  private generateCacheKey(prompt: string, options: any): string {
    const data = JSON.stringify({ prompt, options });
    return createHash('sha256').update(data).digest('hex');
  }
}`,
    hotspots: [
      {
        id: "hs-1",
        x: 20,
        y: 20,
        title: "In-Memory Cache",
        description: "Fastest cache layer with limited capacity, ideal for frequently accessed items.",
      },
      {
        id: "hs-2",
        x: 50,
        y: 50,
        title: "Distributed Cache",
        description: "Redis-based distributed cache for sharing cached results across instances.",
      },
      {
        id: "hs-3",
        x: 80,
        y: 70,
        title: "LLM Service",
        description: "External LLM service that's called only when cache misses occur at all levels.",
      },
    ],
  },
  {
    id: "error-handling",
    title: "Error Handling & Resilience",
    description: "The platform implements comprehensive error handling and resilience patterns to ensure reliability.",
    icon: Code,
    image: "/resilient-system-flow.png",
    codeSnippet: `// Resilience patterns implementation
import { CircuitBreaker } from '@recruitment/resilience';
import { Logger } from '@recruitment/logging';
import { Metrics } from '@recruitment/metrics';

// Create circuit breakers for external services
const llmServiceBreaker = new CircuitBreaker({
  name: 'llm-service',
  failureThreshold: 5,
  resetTimeout: 30000,
  fallback: fallbackLLMHandler
});

const enrichmentServiceBreaker = new CircuitBreaker({
  name: 'enrichment-service',
  failureThreshold: 3,
  resetTimeout: 60000,
  fallback: fallbackEnrichmentHandler
});

// Resilient service call with retries, timeouts, and circuit breaking
export async function processProfileWithResilience(profileData) {
  const logger = new Logger('profile-processor');
  const metrics = new Metrics('profile-processor');
  
  try {
    // Start timing
    const timer = metrics.startTimer('profile_processing_time');
    
    // Use circuit breaker to protect against LLM service failures
    const llmResult = await llmServiceBreaker.execute(async () => {
      // Implement retry logic
      return await withRetry({
        fn: () => callLLMService(profileData),
        retries: 3,
        backoff: 'exponential'
      });
    });
    
    // Use circuit breaker to protect against enrichment service failures
    const enrichmentResult = await enrichmentServiceBreaker.execute(async () => {
      // Implement timeout
      return await withTimeout({
        fn: () => callEnrichmentService(profileData, llmResult),
        timeoutMs: 5000
      });
    });
    
    // Record success
    metrics.increment('profile_processing_success');
    timer.end();
    
    return {
      success: true,
      profile: {
        ...profileData,
        llmInsights: llmResult,
        enrichment: enrichmentResult
      }
    };
  } catch (error) {
    // Record failure
    metrics.increment('profile_processing_failure');
    metrics.increment(\`error_type_\${error.code || 'unknown'}\`);
    
    // Structured error logging
    logger.error('Profile processing failed', {
      profileId: profileData.id,
      errorCode: error.code,
      errorMessage: error.message,
      stack: error.stack
    });
    
    // Return graceful failure response
    return {
      success: false,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: 'Profile processing failed',
        retryable: isRetryableError(error)
      },
      profile: profileData
    };
  }
}`,
    hotspots: [
      {
        id: "hs-1",
        x: 25,
        y: 25,
        title: "Circuit Breaker",
        description: "Prevents cascading failures by stopping calls to failing services.",
      },
      {
        id: "hs-2",
        x: 60,
        y: 40,
        title: "Retry Mechanism",
        description: "Automatically retries failed operations with exponential backoff.",
      },
      {
        id: "hs-3",
        x: 80,
        y: 70,
        title: "Fallback Handlers",
        description: "Provides degraded but functional responses when primary operations fail completely.",
      },
    ],
  },
]

// Carousel component for mobile view
function DiagramCarousel({ diagrams, currentIndex, setCurrentIndex }: any) {
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {React.createElement(diagrams[currentIndex].icon, { className: "h-5 w-5 text-blue-500" })}
              <h3 className="text-lg font-medium">{diagrams[currentIndex].title}</h3>
            </div>

            {/* Larger image container */}
            <div className="relative h-[300px] w-full overflow-hidden rounded-md border shadow-md">
              <Image
                src={diagrams[currentIndex].image || "/placeholder.svg"}
                alt={diagrams[currentIndex].title}
                fill
                className="object-contain"
              />
            </div>

            <p className="text-sm text-gray-600">{diagrams[currentIndex].description}</p>

            <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
              <pre className="text-xs">
                <code className="language-typescript">{diagrams[currentIndex].codeSnippet}</code>
              </pre>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentIndex((prev: number) => (prev === 0 ? diagrams.length - 1 : prev - 1))}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {diagrams.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex ? "bg-blue-500" : "bg-gray-300",
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentIndex((prev: number) => (prev === diagrams.length - 1 ? 0 : prev + 1))}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Zoomable image component with hotspots
function ZoomableImage({ image, alt, hotspots, onHotspotClick }: any) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 1))
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-md border shadow-md">
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 bg-white/80 p-1 rounded-md shadow">
        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8" disabled={scale <= 1}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="h-8 w-8"
          disabled={scale === 1 && position.x === 0 && position.y === 0}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Image container */}
      <div
        ref={containerRef}
        className={cn("relative w-full h-full", scale > 1 ? "cursor-move" : "cursor-default")}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: "center",
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
          className="w-full h-full"
        >
          <Image src={image || "/placeholder.svg"} alt={alt} fill className="object-contain" priority />
        </div>

        {/* Hotspots */}
        {hotspots &&
          hotspots.map((hotspot: any) => (
            <button
              key={hotspot.id}
              className="absolute w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors z-20"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onHotspotClick(hotspot)}
            >
              <Info className="h-4 w-4" />
            </button>
          ))}
      </div>
    </div>
  )
}

interface ConceptualDiagramDisplayProps {
  title: string
  description: string
}

export function ConceptualDiagramDisplay({ title, description }: ConceptualDiagramDisplayProps) {
  const [selectedDiagram, setSelectedDiagram] = useState(diagrams[0].id)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedHotspot, setSelectedHotspot] = useState<any>(null)
  const [isHotspotDialogOpen, setIsHotspotDialogOpen] = useState(false)

  // Check if we're on mobile
  useState(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  })

  // Find the currently selected diagram
  const currentDiagram = diagrams.find((d) => d.id === selectedDiagram) || diagrams[0]

  const handleHotspotClick = (hotspot: any) => {
    setSelectedHotspot(hotspot)
    setIsHotspotDialogOpen(true)
  }

  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile View - Carousel */}
        <div className="md:hidden">
          <DiagramCarousel diagrams={diagrams} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
        </div>

        {/* Desktop View - Dropdown and Content */}
        <div className="hidden md:block space-y-6">
          {/* Dropdown for concept selection */}
          <div className="w-full">
            <Select value={selectedDiagram} onValueChange={setSelectedDiagram}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a concept" />
              </SelectTrigger>
              <SelectContent>
                {diagrams.map((diagram) => (
                  <SelectItem key={diagram.id} value={diagram.id} className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      {React.createElement(diagram.icon, { className: "h-4 w-4" })}
                      <span>{diagram.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content area with prominent image */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {React.createElement(currentDiagram.icon, { className: "h-6 w-6 text-blue-500" })}
              <h3 className="text-xl font-medium">{currentDiagram.title}</h3>
            </div>

            {/* Zoomable image with hotspots */}
            <ZoomableImage
              image={currentDiagram.image}
              alt={currentDiagram.title}
              hotspots={currentDiagram.hotspots}
              onHotspotClick={handleHotspotClick}
            />

            <p className="text-gray-600">{currentDiagram.description}</p>

            {/* Code snippet below the image */}
            <div className="bg-gray-50 rounded-md p-4 overflow-auto max-h-[300px]">
              <pre className="text-sm">
                <code className="language-typescript">{currentDiagram.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Hotspot Dialog */}
        <Dialog open={isHotspotDialogOpen} onOpenChange={setIsHotspotDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedHotspot?.title}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>{selectedHotspot?.description}</p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
