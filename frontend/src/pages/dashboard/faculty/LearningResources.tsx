import FacultyDashboardLayout from "@/components/FacultyDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileText,
  Link as LinkIcon,
  Download,
  Trash2,
  Plus,
} from "lucide-react";

const LearningResources = () => {
  const documents = [
    {
      id: 1,
      title: "Interview Preparation Guide",
      type: "PDF",
      size: "2.4 MB",
      downloads: 145,
      uploadedBy: "Dr. Sharma",
    },
    {
      id: 2,
      title: "Resume Building Tips",
      type: "PDF",
      size: "1.8 MB",
      downloads: 198,
      uploadedBy: "Dr. Gupta",
    },
    {
      id: 3,
      title: "Common Interview Questions",
      type: "DOCX",
      size: "856 KB",
      downloads: 267,
      uploadedBy: "Dr. Patel",
    },
    {
      id: 4,
      title: "Technical Skills Handbook",
      type: "PDF",
      size: "3.2 MB",
      downloads: 312,
      uploadedBy: "Dr. Kumar",
    },
    {
      id: 5,
      title: "Aptitude Practice Questions",
      type: "PDF",
      size: "1.5 MB",
      downloads: 245,
      uploadedBy: "Dr. Singh",
    },
  ];

  return (
    <FacultyDashboardLayout title="Learning Resources">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Input placeholder="Search resources..." className="md:max-w-sm" />
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <LinkIcon size={16} />
              Add Link
            </Button>
            <Button className="gap-2">
              <Upload size={16} />
              Upload Resource
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="text-primary" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{doc.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} • {doc.size} • Uploaded by {doc.uploadedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{doc.downloads}</p>
                      <p className="text-xs text-muted-foreground">downloads</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Download size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add New Document Card */}
        <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Plus size={24} />
            <span className="text-sm font-medium">Add New Document</span>
          </CardContent>
        </Card>
      </div>
    </FacultyDashboardLayout>
  );
};

export default LearningResources;
