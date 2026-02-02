import { TamboComponent } from "@tambo-ai/react";
import * as z from "zod";
import EndpointList from "../components/EndPointList";
import RequestBuilder from "../components/RequestBuilder";
import ResponseViewer from "../components/ResponseViewer";

export const components: TamboComponent[]=[
  {
    name: "EndpointList",
    description: "List of API endpoints",
    component: EndpointList,
    propsSchema: z.object({endpoints: z.array(z.string()).optional()})
  },
  {
    name: "RequestBuilder",
    description: "Simple request builder",
    component: RequestBuilder,
    propsSchema: z.object({onSend: z.any().optional()})
  },
  {
    name: "ResponseViewer",
    description: "Shows JSON Response",
    component: ResponseViewer,
    propsSchema: z.object({data: z.any().optional()})
  }
]
