import { Resource } from "../interfaces/resource";
import { Pagination } from "../response/pagination.type";

export interface ResourceManagementProps {
  type: number;
  title?: string;
  description?: string;
  onSave?: (resource: Omit<Resource, "id" | "createdAt">) => Promise<Resource | void>;
  onDelete?: (resourceId: string) => Promise<void>;
  initialData?: Resource[];
  loading?: boolean;
  pagination?: Pagination;
  onPaginationChange?: (pagination: Pagination) => void;
  onRefresh?: () => void;
}
