"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/nextjs";
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"
import { Button } from "../../components/ui/button";
import { Calendar, BarChart, Users, Clock } from "lucide-react";
import Image from "next/image";
import { PenBox } from "lucide-react";






export function MetricCard({ icon: Icon, title, value }) {
  return (
    <div className="p-4 border border-gray-200 rounded-md bg-white">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
          <Icon className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function ContentCard({ title, actionLabel, actionUrl, children }) {
  return (
    <div className="border border-gray-200 rounded-md bg-white overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        {actionLabel && (
          <Link
            href={actionUrl || "#"}
            className="bg-[#5F9EE9] hover:bg-[#4A8BD6] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            {actionLabel}
          </Link>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function ActionButton({ label, primary = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${primary
          ? "bg-[#5F9EE9] hover:bg-[#4A8BD6] text-white"
          : "bg-gray-800 hover:bg-gray-700 text-white"
        }`}
    >
      {label}
    </button>
  );
}

export function StatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "en cours":
        return "bg-orange-100 text-orange-800";
      case "terminé":
      case "terminer":
        return "bg-green-100 text-green-800";
      case "replanifier":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs ${getStatusStyles()}`}>
      {status}
    </span>
  );
}

export function DataTable({ columns, data, actionLabel = "Accéder" }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, idx) => (
              <th key={idx} className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={idx} className="bg-white">
              {Object.keys(row).map((key, cellIdx) => {
                if (key === "status") {
                  return (
                    <td key={cellIdx} className="px-4 py-3 text-sm">
                      <StatusBadge status={row[key]} />
                    </td>
                  );
                } else if (key === "action") {
                  return (
                    <td key={cellIdx} className="px-4 py-3 text-sm">
                      <ActionButton label={actionLabel} primary />
                    </td>
                  );
                }
                return (
                  <td
                    key={cellIdx}
                    className={`px-4 py-3 text-sm ${key === "title" ? "text-gray-900" : "text-gray-500"
                      }`}
                  >
                    {row[key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatCard({ title, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const { isLoaded } = useUser();

  return (
    <div className="flex  flex-col h-screen">
      {!isLoaded && <BarLoader width="100%" color="#5F9EE9" />}

      <div  className="flex flex-1 overflow-hidden ">
        {/* Main content */}
        <main  className=" flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6  ">
          {/* Navigation Bar */}
           

          {/* Main Content Area */}
          <div className="container mx-auto ">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
              }}
              className="bg-white rounded-b-md  p-4 md:p-6"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}