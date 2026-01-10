import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Briefcase, FileText, Calendar, Check, Trash2 } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "job",
    title: "New Job Posted: Software Engineer at TCS",
    description: "TCS is hiring for Software Engineer position. Apply before Jan 15, 2025.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "resume",
    title: "Resume Feedback Available",
    description: "Your resume has been analyzed. Check the improvements suggested.",
    time: "1 day ago",
    read: false,
  },
  {
    id: 3,
    type: "event",
    title: "Placement Drive on Jan 15, 2025",
    description: "Multiple companies will be visiting. Make sure your profile is complete.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 4,
    type: "job",
    title: "Microsoft Hiring: SDE Position",
    description: "Microsoft is looking for fresh graduates. CGPA 7.0+ required.",
    time: "3 days ago",
    read: true,
  },
  {
    id: 5,
    type: "resume",
    title: "Complete Your Profile",
    description: "Your profile is 75% complete. Add skills and projects to improve visibility.",
    time: "5 days ago",
    read: true,
  },
];

const Notifications = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case "job":
        return <Briefcase className="w-5 h-5 text-primary" />;
      case "resume":
        return <FileText className="w-5 h-5 text-accent" />;
      case "event":
        return <Calendar className="w-5 h-5 text-teal" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout title="Notifications">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">All Notifications</h2>
            <p className="text-sm text-muted-foreground">{unreadCount} unread notifications</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Check size={16} /> Mark all as read
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${!notification.read ? "bg-primary/10" : "bg-secondary"}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Trash2 size={16} className="text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
