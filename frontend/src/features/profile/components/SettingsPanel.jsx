import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Bell,
  Lock,
  Smartphone,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
} from "lucide-react";
import { Card } from "../../../components/ui/Card";

const SettingsSection = ({ icon: Icon, title, description, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 last:border-0">
      <div
        className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-800/50 px-4 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gray-800 rounded-lg">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{title}</h3>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-900/50"
          >
            <div className="p-4 pl-14 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ToggleRow = ({ label, active, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-gray-300">{label}</span>
    <button onClick={onChange} className="focus:outline-none">
      {active ? (
        <ToggleRight className="w-8 h-8 text-purple-500" />
      ) : (
        <ToggleLeft className="w-8 h-8 text-gray-600" />
      )}
    </button>
  </div>
);

export const SettingsPanel = () => {
  const [notifications, setNotifications] = useState({
    matches: true,
    messages: true,
    promotional: false,
  });
  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    incognitoMode: false,
  });

  return (
    <Card className="w-full bg-gray-900 border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 bg-gray-900/80">
        <h2 className="text-lg font-bold text-white">Account Settings</h2>
      </div>

      <div className="flex flex-col">
        <SettingsSection
          icon={Shield}
          title="Security"
          description="Password, 2FA, and account recovery"
        >
          <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">
            Change Password
          </button>
          <button className="text-sm text-purple-400 hover:text-purple-300 font-medium block mt-2">
            Set Up Two-Factor Auth
          </button>
        </SettingsSection>

        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Manage email and push alerts"
        >
          <ToggleRow
            label="New Matches"
            active={notifications.matches}
            onChange={() =>
              setNotifications({
                ...notifications,
                matches: !notifications.matches,
              })
            }
          />

          <ToggleRow
            label="Messages"
            active={notifications.messages}
            onChange={() =>
              setNotifications({
                ...notifications,
                messages: !notifications.messages,
              })
            }
          />

          <ToggleRow
            label="Promotions & Offers"
            active={notifications.promotional}
            onChange={() =>
              setNotifications({
                ...notifications,
                promotional: !notifications.promotional,
              })
            }
          />
        </SettingsSection>

        <SettingsSection
          icon={Lock}
          title="Privacy"
          description="Visibility and online status"
        >
          <ToggleRow
            label="Show Online Status"
            active={privacy.showOnlineStatus}
            onChange={() =>
              setPrivacy({
                ...privacy,
                showOnlineStatus: !privacy.showOnlineStatus,
              })
            }
          />

          <div className="mt-4 p-3 bg-purple-500/10 rounded-lg flex gap-3 border border-purple-500/20">
            <ToggleRight className="w-5 h-5 text-purple-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-purple-300">
                Incognito Mode
              </p>
              <p className="text-xs text-purple-400/70 mt-1">
                Hide your profile from everyone except people you have liked.
              </p>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Smartphone}
          title="Sessions"
          description="Manage devices logged into your account"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    iPhone 14 Pro
                  </p>
                  <p className="text-xs text-green-400">
                    Current Session - San Francisco, CA
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    MacBook Pro
                  </p>
                  <p className="text-xs text-gray-500">
                    Last active 2 days ago - New York, NY
                  </p>
                </div>
              </div>
              <button className="text-xs text-red-400 hover:text-red-300">
                Log Out
              </button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={AlertTriangle}
          title="Danger Zone"
          description="Account deletion and deactivation"
        >
          <button className="text-sm text-red-500 hover:text-red-400 font-medium block">
            Deactivate Account
          </button>
          <button className="text-sm text-red-500 hover:text-red-400 font-medium block mt-2">
            Delete Account Permanently
          </button>
        </SettingsSection>
      </div>
    </Card>
  );
};
