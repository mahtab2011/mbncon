export type NotificationMessage = {
  title: string;
  message: string;
  level: "INFO" | "WARNING" | "CRITICAL";
  createdAt: number;
};

export function buildNotification(
  title: string,
  message: string,
  level: NotificationMessage["level"]
): NotificationMessage {
  return {
    title,
    message,
    level,
    createdAt: Date.now(),
  };
}