"use client";

import React, { useState } from "react";
import { X, Bell } from "lucide-react";

export function GovNotificationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#E65100] text-white px-4 sm:px-6 py-2 text-xs font-medium flex items-center justify-between shadow-xs transition-all animate-in fade-in">
      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
        <p className="tracking-wide text-center sm:text-left">
          National Helpline Against Atrocities is now{" "}
          <strong className="font-bold underline decoration-white/50 underline-offset-2">
            SAMBAL (संबल)
          </strong>{" "}
          — same team, same number.
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="p-1 rounded-md hover:bg-black/15 text-white/80 hover:text-white transition-colors cursor-pointer"
        title="Dismiss Notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
