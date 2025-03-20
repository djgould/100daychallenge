import React from "react";

interface ActivityIconProps {
  type: string;
  className?: string;
  size?: number;
}

const ActivityIcon: React.FC<ActivityIconProps> = ({
  type,
  className = "",
  size = 24,
}) => {
  // Transform type to lowercase for case-insensitive matching
  const activityType = type.toLowerCase();

  // Define icon paths based on activity type
  const getIconPath = () => {
    switch (activityType) {
      case "run":
      case "running":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15.98 5.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM13.48 9.5l-3.75-1.25-2-5.25h3.5l2.5 3.25 1.5 1-1.75 2.25ZM11.73 10l-1 3 4.5 4.25v5h2.25v-6l-4.25-4.5.5-1.75-2 0ZM11.48 13.25l-4.75 1.5v4.5h2.25v-3.5l2.75-.75 2.75 5.25h2.5l-3.5-7-2 0Z"
          />
        );

      case "ride":
      case "cycling":
      case "bicycle":
      case "bike":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 21.75a5.75 5.75 0 1 0 0-11.5 5.75 5.75 0 0 0 0 11.5ZM16 21.75a5.75 5.75 0 1 0 0-11.5 5.75 5.75 0 0 0 0 11.5ZM12 6.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM11.4 8.75l-4.9 5h4l2.5-2.5 2.5 5.5M7 16.75l6.5-6.5 4.5-2.5h3.5"
          />
        );

      case "walk":
      case "walking":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM9.25 21.75h2l1.5-6 2.25 6h2l2.5-11-2.25-.5L16 16l-2-5.75 1.75-1.75-1-1.5h-4.5l-1 1.5 2.25 1.75L9 16.25l-1.75-3.5-2.25.5 2.75 8.5h1.5Z"
          />
        );

      case "swim":
      case "swimming":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 4.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM10 9.75c1.5 1 3.53 1 5 0M10 13.75c1.5 1 3.53 1 5 0M10 17.75c1.5 1 3.53 1 5 0M10 21.75c1.5 1 3.53 1 5 0M19.26 15c0 0 1.89-1.49 2.25-1.5.36-.01 1.94 1.4 1.94 1.4M.55 15c0 0 1.89-1.49 2.25-1.5.36-.01 1.94 1.4 1.94 1.4M16 8.75c-6 0-6 13-6 13"
          />
        );

      case "hike":
      case "hiking":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM17.75 21.75l-.5-8 2.25.5.5-2.5-4-.5-1.5-4h-4.5L8 11.75l-4 .5.25 2.5 2.25-1 .5 8M8.25 11.75l2.25 9 3-5v6"
          />
        );

      case "workout":
      case "training":
      case "exercise":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17.25 6.75h4v4M6.75 17.25h-4v-4M3.75 7.75l3.5-3.5M16.75 20.25l3.5-3.5M20.25 15.75v-8h-8M3.75 8.25v8h8"
          />
        );

      case "weight":
      case "weights":
      case "weighttraining":
      case "strength":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M6.45 17a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM17.55 17a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.75 14.5h3M17.25 14.5h3M9 14.5h6"
          />
        );

      case "yoga":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM8.75 20.5l3-4.25V9.75L9 8l-5.25 7.75L5 17l3.75 3.5ZM15.25 20.5l-3-4.25V9.75L15 8l5.25 7.75L19 17l-3.75 3.5Z"
          />
        );

      default:
        // Trophy/achievement icon as default
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 17.25h-1c-2.76 0-5-2.24-5-5v-7.5h12v7.5c0 2.76-2.24 5-5 5h-1ZM6 4.75h12M12 17.25v4M8.75 22h6.5"
          />
        );
    }
  };

  // Generate color based on activity type
  const getColor = () => {
    switch (activityType) {
      case "run":
      case "running":
        return "text-red-500 dark:text-red-400";
      case "ride":
      case "cycling":
      case "bicycle":
      case "bike":
        return "text-blue-500 dark:text-blue-400";
      case "walk":
      case "walking":
        return "text-green-500 dark:text-green-400";
      case "swim":
      case "swimming":
        return "text-cyan-500 dark:text-cyan-400";
      case "hike":
      case "hiking":
        return "text-amber-500 dark:text-amber-400";
      case "workout":
      case "training":
      case "exercise":
        return "text-pink-500 dark:text-pink-400";
      case "weight":
      case "weights":
      case "weighttraining":
      case "strength":
        return "text-indigo-500 dark:text-indigo-400";
      case "yoga":
        return "text-teal-500 dark:text-teal-400";
      default:
        return "text-purple-500 dark:text-purple-400";
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={`${getColor()} ${className}`}
      aria-label={`${type} activity`}
    >
      {getIconPath()}
    </svg>
  );
};

export default ActivityIcon;
