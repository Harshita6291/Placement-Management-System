import { useState } from "react";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
import { 
  Search, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  User,
  Clock
} from "lucide-react";

const SystemLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [logLevel, setLogLevel] = useState("all");

  const loginLogs = [
    { id: 1, user: "priya.sharma@banasthali.edu", action: "Login Success", ip: "192.168.1.45", device: "Chrome/Windows", timestamp: "2024-01-20 10:30:45", status: "success" },
    { id: 2, user: "unknown@attacker.com", action: "Login Failed", ip: "45.33.32.156", device: "Unknown", timestamp: "2024-01-20 10:28:12", status: "error" },
    { id: 3, user: "meera.gupta@banasthali.edu", action: "Login Success", ip: "192.168.1.67", device: "Safari/MacOS", timestamp: "2024-01-20 10:25:33", status: "success" },
    { id: 4, user: "admin@banasthali.edu", action: "Login Success", ip: "192.168.1.1", device: "Firefox/Linux", timestamp: "2024-01-20 10:20:00", status: "success" },
    { id: 5, user: "ritu.singh@banasthali.edu", action: "Login Failed", ip: "192.168.1.89", device: "Chrome/Android", timestamp: "2024-01-20 10:15:22", status: "warning" },
  ];


  const stats = [
    { label: "Total Logins Today", value: "456", icon: User, color: "text-blue-500" },
    { label: "Failed Attempts", value: "12", icon: AlertTriangle, color: "text-yellow-500" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      case "error":
        return <Badge variant="destructive">Failed</Badge>;
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminDashboardLayout title="System Logs">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-muted rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={logLevel} onValueChange={setLogLevel}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Log Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Login Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Login Activity
            </CardTitle>
          </CardHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  <TableCell>{log.device}</TableCell>
                  <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default SystemLogs;
