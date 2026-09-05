"use client";

import React from "react";
import {
  LayoutGrid,
  FileEdit,
  UserPlus,
  Brain,
  Search,
  HelpCircle,
  PhoneCall,
  ShieldCheck,
  AlertOctagon,
} from "lucide-react";

export type CitizenTab =
  | "dashboard"
  | "register_grievance"
  | "register_rescue"
  | "stress_assessment"
  | "track_status"
  | "help_faqs";

interface SambalSidebarProps {
  activeTab: CitizenTab;
  onSelectTab: (tab: CitizenTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function SambalSidebar({
  activeTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
}: SambalSidebarProps) {
  const menuItems: {
    id: CitizenTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutGrid,
    },
    {
      id: "register_grievance",
      label: "Register Grievance",
      icon: FileEdit,
    },
    {
      id: "register_rescue",
      label: "Register Rescue",
      icon: UserPlus,
    },
    {
      id: "stress_assessment",
      label: "Stress & Trauma Asse...",
      icon: Brain,
      badge: "NEW",
    },
    {
      id: "track_status",
      label: "Track Status",
      icon: Search,
    },
    {
      id: "help_faqs",
      label: "Help & FAQs",
      icon: HelpCircle,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`w-64 bg-white border-r border-[#E5E7EB] flex flex-col justify-between shrink-0 transition-transform duration-200 z-40 ${
          isOpenMobile
            ? "fixed inset-y-0 left-0 shadow-2xl"
            : "hidden lg:flex"
        }`}
      >
        <div className="p-4 space-y-6">
          {/* SAMBAL Brand Header */}
          <div className="flex items-start gap-3 pb-3 border-b border-[#F3F4F6]">
            {/* Sambal Official Emblem */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#EA580C] via-[#2563EB] to-[#0D9488] p-0.5 shrink-0 shadow-xs flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E40AF]">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-[13px] font-extrabold text-[#111827] tracking-tight leading-tight">
                SAMBAL <span className="text-[11px] text-[#2563EB] font-bold">(NHAA 2.0)</span>
              </h2>
              <p className="text-[9px] text-[#6B7280] font-medium leading-tight mt-0.5">
                Smart Access for Mainstreaming of Beneficiaries through Augmented Linkages
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#EBF5FF] text-[#1E40AF] font-bold shadow-xs"
                      : "text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-[#2563EB]" : "text-[#6B7280]"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-extrabold bg-[#2563EB] text-white px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Emergency Helpline Footer Note */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#FAFAFA]">
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#1E40AF] tracking-wider">
                Toll Free 24x7
              </div>
              <div className="text-sm font-black text-[#111827] font-mono tracking-wider">
                14566 / 14567
              </div>
            </div>
          </div>
          <p className="text-[9px] text-[#9CA3AF] text-center mt-2">
            SC/ST Protection &amp; Support Network
          </p>
        </div>
      </aside>
    </>
  );
}
