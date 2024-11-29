import ShareNotificationSettings from "@/components/custom/ShareNotificationSettings";

function TeacherSettings() {
  return (
    <div className="w-3/5">
      <ShareNotificationSettings
        title="Teacher Settings"
        subtitle="Manage your teacher notification settings"
      />
    </div>
  );
}

export default TeacherSettings;
