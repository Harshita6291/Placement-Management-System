import TPODashboardLayout from "@/components/TPODashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Plus,
  Clock,
  Users,
  MapPin,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { useState } from "react";

const DriveScheduling = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");

  // Remove demo drives — drives will be fetched from backend when available
  const drives: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "scheduled":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={14} className="text-green-500" />;
      case "pending":
        return <AlertCircle size={14} className="text-yellow-500" />;
      default:
        return <Clock size={14} className="text-blue-500" />;
    }
  };

  return (
    <TPODashboardLayout title="Drive Scheduling">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">—</p>
                <p className="text-sm text-muted-foreground">Upcoming Drives</p>
              </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-500">—</p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-500">—</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-muted-foreground">—</p>
              <p className="text-sm text-muted-foreground">Completed This Week</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
            >
              List View
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              onClick={() => setViewMode("calendar")}
            >
              Calendar View
            </Button>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Schedule New Drive
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Schedule Placement Drive</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Drive Title</Label>
                  <Input placeholder="Enter drive title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Venue</Label>
                  <Input placeholder="Enter venue" />
                </div>
                <div className="space-y-2">
                  <Label>Eligible Branches</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      <SelectItem value="cse">CSE Only</SelectItem>
                      <SelectItem value="cse-it">CSE & IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea placeholder="Additional details about the drive" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Schedule Drive</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {viewMode === "list" ? (
          /* List View */
          <div className="space-y-4">
            {drives.map((drive) => (
              <Card key={drive.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                        <Briefcase className="text-primary" size={24} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-foreground">
                            {drive.title}
                          </h3>
                          <Badge className={getStatusColor(drive.status)}>
                            {getStatusIcon(drive.status)}
                            <span className="ml-1">{drive.status}</span>
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays size={14} />
                            {drive.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {drive.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {drive.venue}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {drive.roles.map((role, i) => (
                            <Badge key={i} variant="secondary">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {drive.registered}/{drive.eligibleStudents}
                        </p>
                        <p className="text-xs text-muted-foreground">Registered</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Rounds */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Selection Process:</p>
                    <div className="flex flex-wrap gap-2">
                      {drive.rounds.map((round, i) => (
                        <div key={i} className="flex items-center gap-1 text-sm">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                            {i + 1}
                          </span>
                          <span>{round}</span>
                          {i < drive.rounds.length - 1 && (
                            <span className="text-muted-foreground mx-1">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Calendar View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Drives on Selected Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select a date to view scheduled drives</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TPODashboardLayout>
  );
};

export default DriveScheduling;
