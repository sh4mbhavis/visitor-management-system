export interface Visit {
  visitId: number;

  visitorId: number;
  visitorFullName: string;

  hostUserId: number;
  hostUserFullName: string;

  departmentId: number;
  departmentName: string;

  purpose?: string;

  visitDate?: string;

  checkInTime?: string;
  checkOutTime?: string;

  visitStatusId: number;
  visitStatusName: string;

  approvalStatus?: string;
}