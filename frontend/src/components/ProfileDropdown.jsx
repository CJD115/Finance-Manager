import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { User, Settings, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function ProfileDropdown({ collapsed }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, setToken } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  const menuItems = [
    {
      icon: <User size={18} />,
      label: "Profile",
      onClick: () => {
        navigate("/profile");
        setIsOpen(false);
      },
    },
    {
      icon: <Settings size={18} />,
      label: "Settings",
      onClick: () => {
        navigate("/settings");
        setIsOpen(false);
      },
    },
    {
      icon: <HelpCircle size={18} />,
      label: "Help & Support",
      onClick: () => {
        navigate("/help");
        setIsOpen(false);
      },
    },
    {
      icon: <LogOut size={18} />,
      label: "Log out",
      onClick: handleLogout,
      danger: true,
    },
  ];

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    return "U";
  };

  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || "User";
  };

  if (collapsed) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition ${
            isDarkMode
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-primary-600 text-white hover:bg-primary-700"
          }`}
        >
          {getInitials()}
        </button>

        {isOpen && (
          <div
            className={`absolute bottom-full left-0 mb-2 w-56 rounded-xl shadow-lg border overflow-hidden ${
              isDarkMode
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border-neutral-200"
            }`}
          >
            <div
              className={`p-4 border-b ${
                isDarkMode ? "border-neutral-700" : "border-neutral-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm">
                  {getInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm truncate ${
                      isDarkMode ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {getFullName()}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      isDarkMode ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                    item.danger
                      ? "text-red-500 hover:bg-red-50"
                      : isDarkMode
                      ? "text-neutral-300 hover:bg-neutral-700"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
          isDarkMode
            ? "hover:bg-neutral-700 text-neutral-300"
            : "hover:bg-neutral-100 text-neutral-700"
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm">
          {getInitials()}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p
            className={`font-semibold text-sm truncate ${
              isDarkMode ? "text-white" : "text-neutral-900"
            }`}
          >
            {getFullName()}
          </p>
          <p
            className={`text-xs truncate ${
              isDarkMode ? "text-neutral-400" : "text-neutral-500"
            }`}
          >
            {user?.email}
          </p>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute bottom-full left-0 right-0 mb-2 rounded-xl shadow-lg border overflow-hidden ${
            isDarkMode
              ? "bg-neutral-800 border-neutral-700"
              : "bg-white border-neutral-200"
          }`}
        >
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                  item.danger
                    ? "text-red-500 hover:bg-red-50"
                    : isDarkMode
                    ? "text-neutral-300 hover:bg-neutral-700"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

ProfileDropdown.propTypes = {
  collapsed: PropTypes.bool.isRequired,
};
