import TPODashboardLayout from "@/components/TPODashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Users,
  IndianRupee,
  PieChart,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";

const PlacementAnalytics = () => {
  const [selectedYear, setSelectedYear] = useState("2024-25");

  // Placeholder stats and empty datasets until backend provides data
  const overallStats = {
    totalStudents: 0,
    placed: 0,
    percentage: 0,
    avgPackage: "—",
    highestPackage: "—",
    medianPackage: "—",
  };

  const departmentData: any[] = [];
  const sectorDistribution: any[] = [];
  const packageDistribution: any[] = [];
  const yearlyComparison = [
    { year: "2022-23", percentage: 0, avgPackage: "—" },
    { year: "2023-24", percentage: 0, avgPackage: "—" },
    { year: "2024-25", percentage: 0, avgPackage: "—" },
  ];

  return (
    <TPODashboardLayout title="Placement Analytics">
      <div className="space-y-6">
        {/* Year Selector */}
        <div className="flex justify-end">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-25">2024-25</SelectItem>
              <SelectItem value="2023-24">2023-24</SelectItem>
              <SelectItem value="2022-23">2022-23</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Placement Rate</p>
                  <p className="text-3xl font-bold text-foreground">{overallStats.percentage}%</p>
                  <div className="flex items-center gap-1 text-green-500 text-xs">
                    <ArrowUpRight size={12} />
                    <span>+2% from last year</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/20 rounded-lg">
                  <TrendingUp className="text-primary" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Students Placed</p>
                  <p className="text-3xl font-bold text-foreground">
                    {overallStats.placed}/{overallStats.totalStudents}
                  </p>
                  <p className="text-xs text-muted-foreground">130 yet to be placed</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Users className="text-green-500" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Package</p>
                  <p className="text-3xl font-bold text-foreground">{overallStats.avgPackage} LPA</p>
                  <div className="flex items-center gap-1 text-green-500 text-xs">
                    <ArrowUpRight size={12} />
                    <span>+15% from last year</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <IndianRupee className="text-yellow-500" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Highest Package</p>
                  <p className="text-3xl font-bold text-foreground">{overallStats.highestPackage} LPA</p>
                  <p className="text-xs text-muted-foreground">
                    Median: {overallStats.medianPackage} LPA
                  </p>
                </div>
                <div className="p-3 bg-accent/20 rounded-lg">
                  <BarChart3 className="text-accent-foreground" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department-wise Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} className="text-primary" />
                Department-wise Placement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {departmentData.map((dept) => (
                <div key={dept.dept} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{dept.dept}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {dept.placed}/{dept.total} placed
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{dept.percentage}%</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        Avg: {dept.avgPackage} LPA
                      </span>
                    </div>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sector Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart size={20} className="text-primary" />
                Sector-wise Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sectorDistribution.map((item) => (
                <div key={item.type} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.type}</p>
                    <p className="text-sm text-muted-foreground">{item.count} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Package Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee size={20} className="text-primary" />
              Package Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {packageDistribution.map((item) => (
              <div key={item.range} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.range}</span>
                  <span className="font-medium">{item.count} students ({item.percentage}%)</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Year-over-Year Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Year-over-Year Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {yearlyComparison.map((year, index) => (
                <div
                  key={year.year}
                  className={`p-4 rounded-lg border ${
                    year.year === selectedYear
                      ? "bg-primary/10 border-primary/30"
                      : "bg-secondary/50 border-border"
                  }`}
                >
                  <h4 className="font-semibold text-foreground mb-3">{year.year}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Placement Rate</span>
                      <span className="font-medium">{year.percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Package</span>
                      <span className="font-medium">{year.avgPackage} LPA</span>
                    </div>
                    {index > 0 && (
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center gap-1 text-green-500 text-sm">
                          <ArrowUpRight size={14} />
                          <span>
                            +{year.percentage - yearlyComparison[index - 1].percentage}% placement
                          </span>
                        </div>
                      </div>
                    )}
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

export default PlacementAnalytics;
