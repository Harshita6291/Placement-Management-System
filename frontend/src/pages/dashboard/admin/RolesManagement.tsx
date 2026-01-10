import { useState } from "react";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Settings,
  Database,
  FileText,
  Brain,
  Eye,
  Pencil
} from "lucide-react";

const RolesManagement = () => {
  const roles = [
    {
      id: 1,
      name: "Admin",
      description: "Full system access with all permissions",
      users: 3,
      color: "bg-red-500",
      permissions: ["users.manage", "roles.manage", "datasets.manage", "models.manage", "logs.view", "settings.manage"]
    },
    {
      id: 2,
      name: "TPO",
      description: "Training & Placement Officer with company and drive management",
      users: 5,
      color: "bg-blue-500",
      permissions: ["companies.manage", "drives.manage", "students.view", "analytics.view", "reports.generate"]
    },
    {
      id: 3,
      name: "Faculty",
      description: "Faculty members with student progress and resource management",
      users: 45,
      color: "bg-purple-500",
      permissions: ["students.view", "progress.manage", "resources.manage", "analytics.view"]
    },
    {
      id: 4,
      name: "Student",
      description: "Students with access to their own data and resources",
      users: 2156,
      color: "bg-green-500",
      permissions: ["profile.manage", "resume.manage", "jobs.view", "resources.view"]
    },
  ];

  const allPermissions = [
    { category: "Users", permissions: [
      { id: "users.view", label: "View Users", icon: Eye },
      { id: "users.manage", label: "Manage Users", icon: Pencil },
    ]},
    { category: "Roles", permissions: [
      { id: "roles.view", label: "View Roles", icon: Eye },
      { id: "roles.manage", label: "Manage Roles", icon: Pencil },
    ]},
    { category: "Datasets", permissions: [
      { id: "datasets.view", label: "View Datasets", icon: Eye },
      { id: "datasets.manage", label: "Manage Datasets", icon: Pencil },
    ]},
    { category: "ML Models", permissions: [
      { id: "models.view", label: "View Models", icon: Eye },
      { id: "models.manage", label: "Manage Models", icon: Pencil },
    ]},
    { category: "Companies", permissions: [
      { id: "companies.view", label: "View Companies", icon: Eye },
      { id: "companies.manage", label: "Manage Companies", icon: Pencil },
    ]},
    { category: "Drives", permissions: [
      { id: "drives.view", label: "View Drives", icon: Eye },
      { id: "drives.manage", label: "Manage Drives", icon: Pencil },
    ]},
    { category: "Students", permissions: [
      { id: "students.view", label: "View Students", icon: Eye },
      { id: "progress.manage", label: "Manage Progress", icon: Pencil },
    ]},
    { category: "Analytics & Reports", permissions: [
      { id: "analytics.view", label: "View Analytics", icon: Eye },
      { id: "reports.generate", label: "Generate Reports", icon: FileText },
    ]},
    { category: "Resources", permissions: [
      { id: "resources.view", label: "View Resources", icon: Eye },
      { id: "resources.manage", label: "Manage Resources", icon: Pencil },
    ]},
    { category: "Profile", permissions: [
      { id: "profile.manage", label: "Manage Own Profile", icon: Pencil },
      { id: "resume.manage", label: "Manage Resume", icon: FileText },
    ]},
    { category: "Jobs", permissions: [
      { id: "jobs.view", label: "View Jobs", icon: Eye },
    ]},
    { category: "System", permissions: [
      { id: "logs.view", label: "View Logs", icon: Eye },
      { id: "settings.manage", label: "Manage Settings", icon: Settings },
    ]},
  ];

  return (
    <AdminDashboardLayout title="Roles Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">System Roles</h2>
            <p className="text-sm text-muted-foreground">Manage user roles and their permissions</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>Role Name</Label>
                  <Input placeholder="Enter role name" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Enter role description" />
                </div>
                <div className="space-y-4">
                  <Label>Permissions</Label>
                  {allPermissions.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">{category.category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox id={permission.id} />
                            <Label htmlFor={permission.id} className="text-sm font-normal">
                              {permission.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full">Create Role</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center`}>
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {role.name !== "Admin" && role.name !== "Student" && (
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{role.users} users assigned</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.slice(0, 4).map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.split('.')[0]}
                        </Badge>
                      ))}
                      {role.permissions.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Permissions Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions Matrix</CardTitle>
            <CardDescription>Overview of all role permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Permission</th>
                    {roles.map((role) => (
                      <th key={role.id} className="text-center py-3 px-4">{role.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allPermissions.flatMap((category) =>
                    category.permissions.map((permission) => (
                      <tr key={permission.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <permission.icon className="w-4 h-4 text-muted-foreground" />
                            {permission.label}
                          </div>
                        </td>
                        {roles.map((role) => (
                          <td key={role.id} className="text-center py-3 px-4">
                            {role.permissions.includes(permission.id) ? (
                              <Badge variant="default" className="bg-green-500">✓</Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">-</Badge>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default RolesManagement;
