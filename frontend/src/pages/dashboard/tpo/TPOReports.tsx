import TPODashboardLayout from "@/components/TPODashboardLayout";
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
  Users,
  TrendingUp,
  FileText,
  Printer,
} from "lucide-react";
import { useState } from "react";

const TPOReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("semester");

  const reportTypes = [
    {
      id: 1,
      title: "Placement Summary Report",
      description: "Complete overview of placements including department-wise statistics and trends",
      icon: FileBarChart,
      lastGenerated: "1 day ago",
      format: "PDF",
    },
    {
      id: 2,
      title: "Drive Activity Report",
      description: "Details of all placement drives conducted and hiring outcomes",
      icon: Calendar,
      lastGenerated: "3 days ago",
      format: "Excel",
    },
    {
      id: 3,
      title: "Student Placement Report",
      description: "Individual student placement status with offer details and package information",
      icon: Users,
      lastGenerated: "2 days ago",
      format: "PDF",
    },
  ];

  const recentReports = [
    {
      id: 1,
      name: "Placement_Summary_Jan2025.pdf",
      type: "Placement Summary",
      date: "Jan 05, 2025",
      size: "3.2 MB",
      downloads: 12,
    },
    {
      id: 2,
      name: "Drive_Activity_Q4_2024.xlsx",
      type: "Drive Activity",
      date: "Jan 02, 2025",
      size: "1.8 MB",
      downloads: 8,
    },
    {
      id: 3,
      name: "Student_Status_Dec2024.pdf",
      type: "Student Report",
      date: "Dec 28, 2024",
      size: "4.5 MB",
      downloads: 24,
    },
    {
      id: 4,
      name: "Analytics_2024-25.pdf",
      type: "Analytics",
      date: "Dec 25, 2024",
      size: "2.1 MB",
      downloads: 15,
    },
  ];

  const quickStats = [
    { label: "Reports Generated", value: "156", period: "This Academic Year" },
    { label: "Total Downloads", value: "1.2K", period: "All Time" },
    { label: "Scheduled Reports", value: "4", period: "This Month" },
    { label: "Shared with Faculty", value: "23", period: "This Semester" },
  ];

  return (
    <TPODashboardLayout title="Reports">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
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
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Printer size={14} />
                            Preview
                          </Button>
                          <Button size="sm" className="gap-1">
                            <Download size={14} />
                            Generate
                          </Button>
                        </div>
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
                      <FileText size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{report.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.type} • {report.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                      <p className="text-xs text-muted-foreground">{report.downloads} downloads</p>
                    </div>
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
    </TPODashboardLayout>
  );
};

export default TPOReports;
