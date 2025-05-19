import React, { ReactNode } from "react";
import { FormSectionProps } from "./types/listroom";

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  isActive,
}) => {
  if (!isActive) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export default FormSection;
