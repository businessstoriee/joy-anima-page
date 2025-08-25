import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Preview from "@/components/preview/Preview";
import { GreetingFormData } from "@/types/greeting";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  greetingData: GreetingFormData;
  selectedEvent: any;
  onDataChange?: (data: GreetingFormData) => void;
};

export default function PreviewModal({ isOpen, onClose, greetingData, selectedEvent, onDataChange }: Props) {
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative max-w-6xl w-full max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b p-4 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Full Preview</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100"
            >
              ✕
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <Preview 
            greetingData={greetingData} 
            selectedEvent={selectedEvent} 
            // onDataChange={onDataChange}
          />
        </div>
      </div>
    </div>
  );
}