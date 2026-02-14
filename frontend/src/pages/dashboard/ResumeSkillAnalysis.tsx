import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  CheckCircle,
  X,
} from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import auth from "@/lib/auth";

const ResumeSkillAnalysis = () => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const stored = auth.getUser();
      const email = stored?.user?.email;

      const res = await fetch(`http://localhost:5000/api/students/upload-resume`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Student-Email': email,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Upload failed');

      setUploadedFile({ name: file.name, size: file.size });
      toast({
        title: "Resume Uploaded",
        description: "Your resume has been saved successfully",
      });
    } catch (err: any) {
      toast({
        title: "Upload Error",
        description: err?.message || "Failed to upload resume",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <DashboardLayout title="Resume & Skill Analysis">
      <div className="space-y-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="text-primary" />
              Upload Your Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                uploadedFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDragDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleInputChange}
                className="hidden"
              />
              {uploadedFile ? (
                <div className="space-y-2">
                  <CheckCircle className="w-12 h-12 mx-auto text-primary" />
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                    className="gap-2"
                  >
                    <X size={16} /> Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">Drag & drop your resume here</p>
                    <p className="text-sm text-muted-foreground">or click to browse (PDF, DOCX)</p>
                  </div>
                  <Button variant="outline" disabled={loading}>
                    {loading ? "Uploading..." : "Select File"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {uploadedFile && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                ✓ Resume uploaded successfully. Your resume has been saved to your profile.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );

};

export default ResumeSkillAnalysis;
