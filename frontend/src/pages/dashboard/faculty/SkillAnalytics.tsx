import FacultyDashboardLayout from "@/components/FacultyDashboardLayout";
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
  AlertCircle,
  CheckCircle,
  Target,
} from "lucide-react";
import { useState } from "react";

const SkillAnalytics = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const skillDistribution = [
    { skill: "Data Structures & Algorithms", percentage: 72, students: 184 },
    { skill: "Database Management", percentage: 68, students: 174 },
    { skill: "Web Development", percentage: 75, students: 192 },
    { skill: "Machine Learning", percentage: 45, students: 115 },
    { skill: "Cloud Computing", percentage: 38, students: 97 },
    { skill: "Communication Skills", percentage: 65, students: 166 },
    { skill: "Problem Solving", percentage: 70, students: 179 },
    { skill: "System Design", percentage: 42, students: 107 },
  ];

  const departmentComparison = [
    { department: "CSE", avgScore: 78, topSkill: "Web Development", weakSkill: "Cloud Computing" },
    { department: "IT", avgScore: 72, topSkill: "Database Management", weakSkill: "System Design" },
    { department: "ECE", avgScore: 68, topSkill: "Embedded Systems", weakSkill: "Machine Learning" },
    { department: "EE", avgScore: 65, topSkill: "Power Systems", weakSkill: "Programming" },
  ];

  const getSkillColor = (percentage: number) => {
    if (percentage >= 70) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <FacultyDashboardLayout title="Skill Analytics">
      <div className="space-y-6">
        {/* Department Filter */}
        <div className="flex justify-end">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="EE">EE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-sm text-muted-foreground">Skills Above 70%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <TrendingUp className="text-yellow-500" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">2</p>
                  <p className="text-sm text-muted-foreground">Skills Improving</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <AlertCircle className="text-red-500" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">2</p>
                  <p className="text-sm text-muted-foreground">Critical Gaps</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} className="text-primary" />
                Skill Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillDistribution.map((skill) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{skill.skill}</span>
                    <span className="font-medium">
                      {skill.percentage}% ({skill.students} students)
                    </span>
                  </div>
                  <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getSkillColor(skill.percentage)} transition-all`}
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Department Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} className="text-primary" />
                Department-wise Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {departmentComparison.map((dept) => (
                <div
                  key={dept.department}
                  className="p-4 bg-secondary/50 rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-sm">
                      {dept.department}
                    </Badge>
                    <span className="font-bold text-lg">{dept.avgScore}%</span>
                  </div>
                  <Progress value={dept.avgScore} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Top: </span>
                      <span className="text-green-500 font-medium">{dept.topSkill}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Weak: </span>
                      <span className="text-red-500 font-medium">{dept.weakSkill}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </FacultyDashboardLayout>
  );
};

export default SkillAnalytics;
