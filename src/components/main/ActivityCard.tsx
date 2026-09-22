import React from "react";
import { ShoppingBag, Coffee, Car, CreditCard, ArrowRight } from "lucide-react";

// Define the shape of an expense or activity item
interface ActivityItem {
  id: string;
  title: string;
  category: "shopping" | "food" | "transport" | "general";
  date: string;
  amount: number;
}

// Sample data (would typically be fetched from your database)
const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    title: "Grocery Store",
    category: "shopping",
    date: "Today, 2:45 PM",
    amount: 84.5,
  },
  {
    id: "2",
    title: "Cafe Latte",
    category: "food",
    date: "Today, 9:15 AM",
    amount: 4.2,
  },
  {
    id: "3",
    title: "Uber Ride",
    category: "transport",
    date: "Yesterday",
    amount: 12.0,
  },
  {
    id: "4",
    title: "Software Subscription",
    category: "general",
    date: "Sep 20",
    amount: 29.99,
  },
];

// Helper to map categories to specific UI treatments
const getCategoryDetails = (category: string) => {
  switch (category) {
    case "shopping":
      return {
        icon: <ShoppingBag className="w-5 h-5" />,
        color:
          "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
      };
    case "food":
      return {
        icon: <Coffee className="w-5 h-5" />,
        color:
          "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
      };
    case "transport":
      return {
        icon: <Car className="w-5 h-5" />,
        color:
          "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
      };
    default:
      return {
        icon: <CreditCard className="w-5 h-5" />,
        color: "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800",
      };
  }
};

export  function ActivityCard() {
  return (
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800">
      {/* Header section */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Expenses
        </h2>
        <button className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400">
          View all <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* List section */}
      <div className="flex flex-col space-y-1">
        {RECENT_ACTIVITY.map((item) => {
          const { icon, color } = getCategoryDetails(item.category);

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 transition-colors rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-full ${color}`}>{icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.date}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  -${item.amount.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
