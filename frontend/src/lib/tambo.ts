import { TamboComponent } from "@tambo-ai/react";
import * as z from "zod";
import EndpointList from "../components/EndPointList";
import RequestBuilder from "../components/RequestBuilder";
import ResponseViewer from "../components/ResponseViewer";
import SafetyInspector from "../components/SafetyInspector";

export const components: TamboComponent[] = [
  {
    name: "EndpointList",
    description: "Interactive list of API endpoints with selection support",
    component: EndpointList,
    propsSchema: z.object({
      endpoints: z.array(z.object({
        path: z.string(),
        method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
        description: z.string().optional()
      })).optional()
    })
  },
  {
    name: "RequestBuilder",
    description: "Build API requests with headers and body editing",
    component: RequestBuilder,
    propsSchema: z.object({
      endpoint: z.object({
        path: z.string(),
        method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
        description: z.string().optional()
      }).nullable().optional(),
      disabled: z.boolean().optional()
    })
  },
  {
    name: "ResponseViewer",
    description: "Display API responses with syntax highlighting",
    component: ResponseViewer,
    propsSchema: z.object({
      data: z.any().optional(),
      statusCode: z.number().optional(),
      loading: z.boolean().optional()
    })
  },
  {
    name: "SafetyInspector",
    description: "Display safety analysis results with risk indicators",
    component: SafetyInspector,
    propsSchema: z.object({
      verdict: z.object({
        urgency: z.boolean(),
        threat: z.boolean(),
        sensitive_request: z.boolean(),
        explanation: z.string(),
        risk_score: z.number().optional(),
        recommendations: z.array(z.string()).optional(),
        detected_patterns: z.array(z.string()).optional()
      }).nullable().optional(),
      loading: z.boolean().optional()
    })
  }
];

export const tools: never[] = [];
