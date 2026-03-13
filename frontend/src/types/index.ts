export interface User {
  id: string; phone: string; name: string
  role: 'investor' | 'admin' | 'mechanic'; kycVerified: boolean; createdAt: string
}
export interface Vehicle {
  id: string; ownerId: string; make: string; model: string; year: number
  registrationNumber: string; assetValue: number
  status: 'active' | 'audit_pending' | 'paused' | 'maintenance' | 'available'
  healthScore: number; lastAuditDate: string; totalTrips: number; guestRating: number; imageUrl?: string
}
export interface Trip {
  id: string; vehicleId: string; guestName: string; startDate: string; endDate: string
  grossRent: number; platformFee: number; mechanixDeduction: number; netYield: number
  status: 'completed' | 'active' | 'upcoming' | 'cancelled'
}
export interface Payout {
  id: string; investorId: string; vehicleId: string; month: string
  grossRevenue: number; platformFee: number; mechanixDeductions: number; netPayout: number
  status: 'pending' | 'processed' | 'failed'; processedAt?: string
}
export type AuditResult = 'pass' | 'fail' | 'needs_repair' | 'pending'
export interface AuditItem {
  id: string; category: string; label: string
  result: AuditResult; evidenceUrl?: string; notes?: string; repairCost?: number
}
export interface MechanixAudit {
  id: string; vehicleId: string; mechanicId: string; createdAt: string
  completedAt?: string; items: AuditItem[]
  overallResult: 'pass' | 'fail' | 'incomplete'
  healthCertificateUrl?: string; invoiceUrl?: string; totalRepairCost: number
}
export interface Ticket {
  id: string; investorId: string; vehicleId?: string; subject: string; message: string
  status: 'open' | 'in_progress' | 'resolved'; priority: 'low' | 'medium' | 'high' | 'urgent'
  replies: TicketReply[]; createdAt: string
}
export interface TicketReply {
  id: string; senderId: string; senderRole: 'investor' | 'admin'; message: string; createdAt: string
}
export interface Lead {
  id: string; companyName: string; contactName: string; email: string; phone: string
  vehicleCount: number; message: string; source: string
  status: 'new' | 'contacted' | 'qualified' | 'closed_won' | 'closed_lost'; createdAt: string
}
export interface InvestorStats {
  lockedRevenue: number; nextPayoutDate: string; nextPayoutAmount: number
  thisMonthNet: number; thisMonthGross: number; totalEarned: number
  upcomingBookings: number; pauseDaysUsed: number; pauseDaysRemaining: number
}
export interface AdminStats {
  totalGrossRevenue: number; platformCut: number; activeVehicles: number
  totalInvestors: number; pendingKyc: number; openTickets: number; todayTrips: number
}
