/**
 * Regional State Metadata for Agricultural Analysis
 */
import { STATES } from "@/lib";

export type State = typeof STATES[keyof typeof STATES]['value'];
