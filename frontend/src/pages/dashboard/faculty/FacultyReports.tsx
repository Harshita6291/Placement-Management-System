import FacultyDashboardLayout from "@/components/FacultyDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileBarChart,
  Download,
  Calendar,
  TrendingUp,
  Users,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

const FacultyReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("semester");

  const reportTypes = [
    {
      id: 1,
      title: "Academic Planning Report",
      description: "Comprehensive analysis of student academic performance and placement readiness",
      icon: BookOpen,
      lastGenerated: "2 days ago",
      format: "PDF",
    },
    {
      id: 2,
      title: "Skill Gap Analysis Report",
      description: "Department-wise skill gap identification and curriculum recommendations",
      icon: TrendingUp,
      lastGenerated: "1 week ago",
      format: "PDF",
    },
    {
      id: 3,
      title: "Student Progress Report",
      description: "Individual and batch-wise student progress tracking report",
      icon: Users,
      lastGenerated: "3 days ago",
      format: "Excel",
    },
  ];

  const recentReports = [
    {
      id: 1,
      name: "CSE_Batch2025_Progress_Report.pdf",
      type: "Student Progress",
      date: "Dec 28, 2024",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Skill_Gap_Analysis_Q4_2024.pdf",
      type: "Skill Analysis",
      date: "Dec 25, 2024",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "Placement_Readiness_Dec2024.xlsx",
      type: "Placement Report",
      date: "Dec 20, 2024",
      size: "956 KB",
    },
  ];

  const analytics = [
    { label: "Reports Generated", value: "47", change: "+12%", period: "This Semester" },
    { label: "Data Points Analyzed", value: "15.2K", change: "+8%", period: "This Month" },
    { label: "Students Tracked", value: "256", change: "0%", period: "Current Batch" },
    { label: "Departments Covered", value: "4", change: "0%", period: "All Time" },
  ];

  return (
    <FacultyDashboardLayout title="Reports">
      <div className="space-y-6">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <Badge
                      variant="outline"
                      className={
                        stat.change.startsWith("+")
                          ? "text-green-500 border-green-500/20"
                          : ""
                      }
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.period}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Period Selector */}
        <div className="flex justify-end">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <Calendar size={16} className="mr-2" />
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Generate Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart size={20} className="text-primary" />
              Generate Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => (
                <div
                  key={report.id}
                  className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <report.icon className="text-primary" size={20} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">{report.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {report.format}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-muted-foreground">
                          Last generated: {report.lastGenerated}
                        </p>
                        <Button size="sm" className="gap-1">
                          <Download size={14} />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-lg">
                      <FileBarChart size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{report.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.type} • {report.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                    <Button variant="ghost" size="icon">
                      <Download size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FacultyDashboardLayout>
  );
};

export default FacultyReports;
