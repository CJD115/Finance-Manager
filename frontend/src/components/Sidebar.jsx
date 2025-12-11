import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  Target,
  PiggyBank,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

export default function AppSidebar() {
  const location = useLocation();
  const { setToken } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    setToken(null);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor="#F0EFF1"
      width="250px"
      collapsedWidth="80px"
      style={{ height: "100vh", position: "sticky", top: 0 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
              F
            </div>
            <span className="text-xl font-semibold text-neutral-900">
              FinSet
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-neutral-200 rounded-lg transition"
        >
          <span className="text-neutral-700">{collapsed ? "→" : "←"}</span>
        </button>
      </div>

      <Menu
        menuItemStyles={{
          button: ({ active }) => ({
            backgroundColor: active ? "#8470FF" : "transparent",
            color: active ? "#FFFFFF" : "#56565E",
            borderRadius: "8px",
            margin: "4px 8px",
            padding: "12px",
            fontWeight: active ? "600" : "500",
            "&:hover": {
              backgroundColor: active ? "#8470FF" : "#D0D0D4",
              color: active ? "#FFFFFF" : "#111113",
            },
          }),
        }}
      >
        <MenuItem
          active={isActive("/")}
          component={<Link to="/" />}
          icon={<LayoutDashboard size={20} />}
        >
          Dashboard
        </MenuItem>

        <MenuItem
          active={isActive("/transactions")}
          component={<Link to="/transactions" />}
          icon={<CreditCard size={20} />}
        >
          Transactions
        </MenuItem>

        <MenuItem
          active={isActive("/wallet")}
          component={<Link to="/wallet" />}
          icon={<Wallet size={20} />}
        >
          Wallet
        </MenuItem>

        <MenuItem
          active={isActive("/goals")}
          component={<Link to="/goals" />}
          icon={<Target size={20} />}
        >
          Goals
        </MenuItem>

        <MenuItem
          active={isActive("/budget")}
          component={<Link to="/budget" />}
          icon={<PiggyBank size={20} />}
        >
          Budget
        </MenuItem>

        <MenuItem
          active={isActive("/analytics")}
          component={<Link to="/analytics" />}
          icon={<TrendingUp size={20} />}
        >
          Analytics
        </MenuItem>

        <MenuItem
          active={isActive("/settings")}
          component={<Link to="/settings" />}
          icon={<Settings size={20} />}
        >
          Settings
        </MenuItem>
      </Menu>

      <div className="absolute bottom-0 w-full border-t border-neutral-200 p-2">
        <Menu
          menuItemStyles={{
            button: {
              color: "#56565E",
              borderRadius: "8px",
              padding: "12px",
              "&:hover": {
                backgroundColor: "#D0D0D4",
              },
            },
          }}
        >
          <MenuItem icon={<HelpCircle size={20} />}>Help</MenuItem>
          <MenuItem icon={<LogOut size={20} />} onClick={handleLogout}>
            Log out
          </MenuItem>
        </Menu>

        {!collapsed && (
          <div className="flex items-center gap-2 px-4 py-3">
            <button className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white">
              <Sun size={18} />
            </button>
            <button className="w-10 h-10 bg-neutral-300 rounded-full flex items-center justify-center">
              <Moon size={18} />
            </button>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
