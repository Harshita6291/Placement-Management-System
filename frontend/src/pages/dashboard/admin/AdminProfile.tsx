import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Shield, Building2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import auth from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const AdminProfile = () => {
  const { toast } = useToast();
  // Cleared demo values — will be populated from backend or user input
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  // department removed for admin
    role: "",
    employeeId: "",
  accessLevel: "Full",
  });

  useEffect(() => {
    const stored = auth.getUser();
    if (stored && stored.user && stored.role === "admin") {
  setProfile((p) => ({ ...p, ...stored.user, accessLevel: stored.user.accessLevel || 'Full' }));
    }
  }, []);

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleSaveRemote = async () => {
    try {
      const stored = auth.getUser();
      const role = stored?.role || "admin";
      const roleToPath = (r: string) => (r === "student" ? "students" : r === "faculty" ? "faculty" : r === "tpo" ? "tpo" : r === "admin" ? "admin" : "students");
      const path = roleToPath(role);

      const res = await fetch(`http://localhost:5000/api/${path}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, ...profile }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");

      const updated = data.admin || data.user || data[role] || data;
      if (updated) auth.saveUser(updated, role);

      toast({ title: "Profile Updated", description: data?.message || "Your profile has been saved successfully." });
    } catch (err: any) {
      toast({ title: "Save Error", description: err?.message || "Unable to save", variant: "destructive" });
    }
  };

  return (
    <AdminDashboardLayout title="My Profile">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-destructive/10 via-destructive/5 to-destructive/10 p-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-4xl font-bold shadow-lg">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.role}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User size={16} /> Full Name
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail size={16} /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone size={16} /> Phone
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId" className="flex items-center gap-2">
                  <Building2 size={16} /> Employee ID
                </Label>
                <Input
                  id="employeeId"
                  value={profile.employeeId}
                  onChange={(e) => setProfile({ ...profile, employeeId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Shield size={16} /> Role
                </Label>
                <Input
                  id="role"
                  value={profile.role}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessLevel" className="flex items-center gap-2">
                <Shield size={16} /> Access Level
              </Label>
              <Input
                id="accessLevel"
                value={profile.accessLevel}
                readOnly
                className="bg-muted"
              />
            </div>

            <Button onClick={handleSaveRemote} className="gap-2">
              <Save size={16} /> Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminProfile;
