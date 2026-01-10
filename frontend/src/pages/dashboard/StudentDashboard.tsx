import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Target,
  TrendingUp,
  Bell,
  ChevronRight,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Placement Probability",
    value: "78%",
    icon: Target,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Resume Score",
    value: "85/100",
    icon: FileText,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Skills Matched",
    value: "12/15",
    icon: TrendingUp,
    color: "text-teal",
    bgColor: "bg-teal/10",
  },
];

const quickActions = [
  { label: "Upload Resume", icon: Upload, path: "/dashboard/student/resume" },
  { label: "View Predictions", icon: Target, path: "/dashboard/student/prediction" },
  { label: "Career Paths", icon: TrendingUp, path: "/dashboard/student/career" },
];

const notifications = [
  { title: "New Job Posted: Software Engineer at TCS", time: "2 hours ago" },
  { title: "Resume feedback available", time: "1 day ago" },
  { title: "Placement drive on Jan 15, 2025", time: "2 days ago" },
];

const StudentDashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-teal/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, <span className="gradient-text">Student!</span>
          </h2>
          <p className="text-muted-foreground">
            Your placement journey is progressing well. Keep up the good work!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-card transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Completion */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-sm font-semibold">75%</span>
              </div>
              <Progress value={75} className="h-3" />
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {[
                  { label: "Personal Info", done: true },
                  { label: "Education", done: true },
                  { label: "Skills", done: true },
                  { label: "Resume", done: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      item.done ? "bg-primary/10" : "bg-secondary"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        item.done
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.done ? "✓" : "!"}
                    </div>
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-between"
                  asChild
                >
                  <Link to={action.path}>
                    <span className="flex items-center gap-2">
                      <action.icon size={18} />
                      {action.label}
                    </span>
                    <ChevronRight size={16} />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              Recent Notifications
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/student/notifications">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
