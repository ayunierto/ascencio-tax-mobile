import { Service as SharedService, StaffMember } from "@ascencio-tax/shared";

// Re-export from shared package
export type { StaffMember };
export type Service = SharedService;

// Legacy Staff interface for backward compatibility (deprecated)
/** @deprecated Use StaffMember instead */
export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
