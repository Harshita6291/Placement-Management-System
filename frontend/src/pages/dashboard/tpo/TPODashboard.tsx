import TPODashboardLayout from "@/components/TPODashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  CalendarDays,
  TrendingUp,
  CheckCircle,
  Briefcase,
  IndianRupee,
} from "lucide-react";

const TPODashboard = () => {
  // Cleared demo data so dashboards start empty and show live data when available
  const upcomingDrives: any[] = [];
  const recentPlacements: any[] = [];
  const departmentStats: any[] = [];

  const totalStudents = 0;
  const studentsPlaced = 0;
  const upcomingCount = upcomingDrives.length;
  const avgPackage = "—";

  return (
    <TPODashboardLayout title="TPO Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Eligible for placement</p>
                </div>
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Users className="text-primary" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Students Placed</p>
                  <p className="text-2xl font-bold text-foreground">{studentsPlaced}</p>
                  <p className="text-xs text-green-500">—</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Drives</p>
                  <p className="text-2xl font-bold text-foreground">{upcomingCount}</p>
                  <p className="text-xs text-yellow-500">Next 30 days</p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <CalendarDays className="text-yellow-500" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Package</p>
                  <p className="text-2xl font-bold text-foreground">{avgPackage} LPA</p>
                  <p className="text-xs text-green-500">—</p>
                </div>
                <div className="p-3 bg-accent/20 rounded-lg">
                  <IndianRupee className="text-accent-foreground" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Drives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays size={20} className="text-primary" />
                Upcoming Placement Drives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDrives.map((drive, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CalendarDays className="text-primary" size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{drive.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {drive.date} • {drive.roles} roles
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={drive.status === "confirmed" ? "default" : "secondary"}
                    className={
                      drive.status === "confirmed"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : ""
                    }
                  >
                    {drive.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Placements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase size={20} className="text-primary" />
                Recent Placements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPlacements.map((placement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                      {placement.student.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{placement.student}</p>
                      <p className="text-sm text-muted-foreground">{placement.role}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    {placement.package}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Department-wise Placement Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Department-wise Placement Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {departmentStats.map((dept) => (
                <div key={dept.department} className="p-4 bg-secondary/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-sm font-medium">
                      {dept.department}
                    </Badge>
                    <span className="text-lg font-bold text-foreground">{dept.percentage}%</span>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {dept.placed} / {dept.total} students placed
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="p-6 flex flex-col items-center gap-2 text-center">
              <CalendarDays className="text-primary" size={32} />
              <h3 className="font-semibold">Schedule Drive</h3>
              <p className="text-sm text-muted-foreground">Create a new placement drive</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="p-6 flex flex-col items-center gap-2 text-center">
              <Users className="text-primary" size={32} />
              <h3 className="font-semibold">View Eligible Students</h3>
              <p className="text-sm text-muted-foreground">Check student eligibility list</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TPODashboardLayout>
  );
};

export default TPODashboard;
