import React, { ReactNode } from "react";
export interface RoomFormDetailsProps {
  blockType: string;
  setBlockType: (value: string) => void;
  blockName: string;
  setBlockName: (value: string) => void;
  floor: string;
  setFloor: (value: string) => void;
  wing: string;
  setWing: (value: string) => void;
  roomNumber: string;
  setRoomNumber: (value: string) => void;
  sharing: string;
  setSharing: (value: string) => void;
  goToStep: (step: string) => void;
}

export interface RoomFormImagesProps {
  images: File[];
  setImages: (images: File[]) => void;
  goToStep: (step: string) => void;
}

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  isActive: boolean;
}

export interface ToggleAvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAvailable: boolean;
  isUpdating: boolean;
  onConfirm: () => void;
}