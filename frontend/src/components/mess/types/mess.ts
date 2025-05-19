
// Menu types
export type MealItem = string | string[] | Record<string, string>;
export type DailyMeals = Record<string, MealItem>;
export type WeeklyMenu = Record<string, DailyMeals>;

// Review type
export type Review = {
  user: string;
  rating: number;
  comment: string;
  date?: string;
};

// Hygiene info type
export type HygieneInfo = {
  score: number;
  details: string[];
};

// Contact info type
export type ContactInfo = {
  manager: string;
  phone: string;
  email: string;
  hours: string;
};

// Timings type
export type MessTimings = {
  breakfast: string;
  lunch: string;
  dinner: string;
};



export interface Mess {
  id: number; 
  name: string;
  type: string;
  location: string;
  timings: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  weeklyMenu?: WeeklyMenu;
  vacancyCount: number;
  rating?: number;
  reviewCount?: number;
  facilities?: string[];
  contact: ContactInfo; 
  hygiene: HygieneInfo;
  reviews: any[];
}

// Mess assignment type
export type MessAssignment = {
  messId: number;
  messName: string;
  messType: string;
  messLocation: string;
};

// API response types
export type MessListResponse = {
  data: Mess[];
};

export type MessAssignmentResponse = {
  data: MessAssignment;
};

export type MessRegisterResponse = {
  data: MessAssignment;
};

export type MessSwapResponse = {
  data: {
    messAssignment: MessAssignment;
    receipt: any;
  };
};

// Form state types
export type SwapRequestForm = {
  preferredMess: string;
  reason: string;
  comments: string;
};

export type RegistrationForm = {
  messId: string;
};

// Contact info record type
export type ContactInfoRecord = Record<string, ContactInfo>;

// Props for components
export type MessMainContentProps = {
  messes: Mess[];
  currentMess: Mess | null;
  error: string | null;
  registrationForm: RegistrationForm;
  swapRequest: SwapRequestForm;
  handleRegistrationFormChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSwapFormChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => void;
  registerCurrentMess: (e: React.FormEvent) => Promise<void>;
  submitSwapRequest: (e: React.FormEvent) => Promise<void>;
  openModal: (id: number) => void;
};

export type MessDetailsModalProps = {
  selectedMess: Mess;
  currentMess: Mess | null;
  weeklyMenu: Record<number, WeeklyMenu>;
  activeTab: "details" | "menu" | "reviews";
  setActiveTab: React.Dispatch<React.SetStateAction<"details" | "menu" | "reviews">>;
  closeModal: () => void;
  setRegistrationForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
  setSwapRequest: React.Dispatch<React.SetStateAction<SwapRequestForm>>;
};

export type MessChangeReceiptProps = {
  receiptData: any;
  onClose: () => void;
};

export type StarRatingProps = {
  rating: number;
};


export interface Timing {
  breakfast: string;
  lunch: string;
  dinner: string;
}


export interface RegistrationFormData {
  messId: string | number;
}

export interface SwapRequestData {
  preferredMess: string | number;
  reason: string;
  comments: string;
}

