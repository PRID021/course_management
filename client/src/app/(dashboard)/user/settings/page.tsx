import ShareNotificationSettings from "@/components/custom/ShareNotificationSettings";

function UserSettings() {
  return (
    <div className="w-3/5">
      <ShareNotificationSettings
        title="User Settings"
        subtitle="Manage your user notification settings"
      />
    </div>
  );
}

export default UserSettings;
