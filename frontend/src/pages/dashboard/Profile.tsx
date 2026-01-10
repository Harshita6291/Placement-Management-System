import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, GraduationCap, Code, Save } from "lucide-react";
import { useState, useEffect } from "react";
import auth from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
  year: "",
    cgpa: "",
    skills: "",
  });

  useEffect(() => {
    const stored = auth.getUser();
    if (stored && stored.user) {
      setProfile((p) => ({ ...p, ...stored.user }));
    }
  }, []);

  const handleSave = async () => {
    try {
      const stored = auth.getUser();
      const role = stored?.role || "student";
      const roleToPath = (r: string) => (r === "student" ? "students" : r === "faculty" ? "faculty" : r === "tpo" ? "tpo" : r === "admin" ? "admin" : "students");
      const path = roleToPath(role);

      const res = await fetch(`http://localhost:5000/api/${path}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, ...profile }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");

      // pick updated user from response
      const updated = data.student || data.user || data[role] || data;
      if (updated) {
        auth.saveUser(updated, role);
      }

      toast({ title: "Profile Updated", description: data?.message || "Your profile has been saved successfully." });
    } catch (err: any) {
      toast({ title: "Save Error", description: err?.message || "Unable to save", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-teal/10 p-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl font-bold shadow-lg">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.branch}</p>
                <p className="text-sm text-muted-foreground">{profile.year} • CGPA: {profile.cgpa}</p>
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
                <Label htmlFor="year" className="flex items-center gap-2">
                  <GraduationCap size={16} /> Year
                </Label>
                <select
                  id="year"
                  value={profile.year}
                  onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                  className="w-full h-12 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Year</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cgpa" className="flex items-center gap-2">
                  <GraduationCap size={16} /> CGPA
                </Label>
                <Input
                  id="cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={profile.cgpa}
                  onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="flex items-center gap-2">
                <Code size={16} /> Skills (comma separated)
              </Label>
              <Input
                id="skills"
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              />
            </div>

            <Button onClick={handleSave} className="gap-2">
              <Save size={16} /> Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
