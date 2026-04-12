import { ROLE } from "@/lib";

export type RoleType = typeof ROLE[keyof typeof ROLE]['value'];
