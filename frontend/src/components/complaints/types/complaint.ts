
export interface Complaint {
  id: string;
  _id?: string; 
  type: string;
  priority: string;
  status: string;
  subject: string;
  date: string;
  complaintId: string;
  description?: string;
  email?: string;
  roomNumber?: string;
  updates?: ComplaintUpdate[];
  evidence?: File | null;
  title: string;
  createdAt: string | Date;
  hasAttachments?: boolean;
  commentCount?: number;
}

export interface ComplaintCardProps {
  complaint: Complaint;
}

export interface ComplaintUpdate {
  title: string;
  date: string;
  message: string;
  staffName: string;
  staffRole: string;
}

export interface ComplaintResponse {
  success: boolean;
  data: Array<Complaint> | { complaintId: string; [key: string]: any };
  message?: string;
}

export interface ComplaintFormState {
  type: string;
  priority: string;
  email: string;
  roomNumber: string;
  subject: string;
  description: string;
  file: File | null;
  isSubmitting: boolean;
  isSubmitted: boolean;
  complaintId: string;
}

export interface ComplaintType {
  value: string;
  label: string;
  icon: JSX.Element;
}

export interface PriorityLevel {
  value: string;
  label: string;
  color: string;
}