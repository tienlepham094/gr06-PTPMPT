enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
}
enum STATE {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
enum RESOURCETYPE {
  GPU = "GPU",
  CPU = "CPU",
  MEMORY = "MEMORY",
  STORAGE = "STORAGE",
  NETWORK = "NETWORK",
}
enum STATUSREQUEST {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}
enum REQUESTSTATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  QUEUED = "QUEUED",
  COMPLETED = "COMPLETED",
}
enum RESOURCESTATUS {
  AVAILABLE = "available",
  ALLOCATED = "allocated",
  MAINTENANCE = "maintenance",
}
export const RESOURCESTATUS_TRANSLATION = {
  [RESOURCESTATUS.ALLOCATED]: "Đang được sử dụng",
  [RESOURCESTATUS.AVAILABLE]: "Có sẵn",
  [RESOURCESTATUS.MAINTENANCE]: "Bảo trì",
};
enum APPROVALSTATUS {
  APPROVED = "approve",
  REJECTED = "reject",
  QUEUED = "queue",
}
export const APPROVALSTATUS_TRANSLATION = {
  [APPROVALSTATUS.APPROVED]: "Chấp thuận",
  [APPROVALSTATUS.QUEUED]: "Cho chờ",
  [APPROVALSTATUS.REJECTED]: "Từ chối",
};

export {
  ROLE,
  STATE,
  RESOURCETYPE,
  REQUESTSTATUS,
  STATUSREQUEST,
  RESOURCESTATUS,
  APPROVALSTATUS,
};
