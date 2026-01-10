import FacultyDashboardLayout from "@/components/FacultyDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";

const StudentProgress = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // demo students removed — will be populated from backend when available
  const students: any[] = [];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || student.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp size={16} className="text-green-500" />;
      case "down":
        return <TrendingDown size={16} className="text-red-500" />;
      default:
        return <Minus size={16} className="text-muted-foreground" />;
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return "text-green-500";
    if (probability >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <FacultyDashboardLayout title="Student Progress">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-500">—</p>
              <p className="text-sm text-muted-foreground">High Performers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-500">—</p>
              <p className="text-sm text-muted-foreground">Average</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-500">—</p>
              <p className="text-sm text-muted-foreground">Need Attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">—</p>
              <p className="text-sm text-muted-foreground">Improving</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Department" />
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
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Placement Probability</TableHead>
                  <TableHead>Skill Score</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className={`font-medium ${getProbabilityColor(student.placementProbability)}`}>
                          {student.placementProbability}%
                        </span>
                        <Progress value={student.placementProbability} className="h-1.5 w-20" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="font-medium">{student.skillScore}%</span>
                        <Progress value={student.skillScore} className="h-1.5 w-20" />
                      </div>
                    </TableCell>
                    <TableCell>{getTrendIcon(student.trend)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {student.lastActive}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </FacultyDashboardLayout>
  );
};

export default StudentProgress;
