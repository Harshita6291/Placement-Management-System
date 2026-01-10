import FacultyDashboardLayout from "@/components/FacultyDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Target,
} from "lucide-react";

const FacultyDashboard = () => {
  const studentReadiness = [
    { label: "High Probability", count: 45, percentage: 45, color: "bg-green-500" },
    { label: "Medium Probability", count: 35, percentage: 35, color: "bg-yellow-500" },
    { label: "Low Probability", count: 20, percentage: 20, color: "bg-red-500" },
  ];

  const skillPreparedness = [
    { skill: "Technical Skills", score: 78 },
    { skill: "Communication", score: 65 },
    { skill: "Problem Solving", score: 82 },
    { skill: "Domain Knowledge", score: 70 },
  ];

  const departmentGaps = [
    { department: "CSE", gap: "Cloud Computing", severity: "high" },
    { department: "IT", gap: "Data Structures", severity: "medium" },
    { department: "ECE", gap: "Embedded Systems", severity: "low" },
    { department: "EE", gap: "Power Electronics", severity: "medium" },
  ];

  const recentResources = [
    { title: "DSA Interview Prep", type: "Course", views: 234 },
    { title: "System Design Guide", type: "Document", views: 189 },
    { title: "Aptitude Practice Set", type: "Quiz", views: 156 },
  ];

  return (
    <FacultyDashboardLayout title="Faculty Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">256</p>
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
                  <p className="text-sm text-muted-foreground">Placement Ready</p>
                  <p className="text-2xl font-bold text-foreground">142</p>
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
                  <p className="text-sm text-muted-foreground">Need Attention</p>
                  <p className="text-2xl font-bold text-foreground">58</p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="text-yellow-500" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resources Shared</p>
                  <p className="text-2xl font-bold text-foreground">34</p>
                </div>
                <div className="p-3 bg-accent/20 rounded-lg">
                  <BookOpen className="text-accent-foreground" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Readiness Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Student Readiness Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-foreground">72%</p>
                <p className="text-sm text-muted-foreground">Average Placement Probability</p>
              </div>
              {studentReadiness.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.count} students ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skill Preparedness Index */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} className="text-primary" />
                Skill Preparedness Index
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillPreparedness.map((item) => (
                <div key={item.skill} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.skill}</span>
                    <span className="font-medium">{item.score}%</span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Gap Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-yellow-500" />
                Skill Gap Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {departmentGaps.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.department}</p>
                      <p className="text-sm text-muted-foreground">{item.gap}</p>
                    </div>
                    <Badge
                      variant={
                        item.severity === "high"
                          ? "destructive"
                          : item.severity === "medium"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {item.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Learning Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                Recent Learning Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentResources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">{resource.title}</p>
                      <p className="text-sm text-muted-foreground">{resource.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{resource.views}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FacultyDashboardLayout>
  );
};

export default FacultyDashboard;
