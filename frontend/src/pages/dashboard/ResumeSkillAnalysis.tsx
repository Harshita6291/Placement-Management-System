import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  XCircle,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

const mockAnalysis = {
  score: 85,
  skills: ["React", "TypeScript", "Python", "Machine Learning", "SQL", "Git"],
  improvements: [
    "Add quantifiable achievements to experience section",
    "Include more industry-specific keywords",
    "Add a professional summary at the top",
    "Include relevant certifications",
  ],
  strengths: [
    "Good technical skills section",
    "Clear education background",
    "Well-structured layout",
  ],
};

const skillsData = {
  existing: ["React", "JavaScript", "HTML/CSS", "Git", "Python", "SQL"],
  required: ["TypeScript", "Node.js", "System Design", "Docker", "AWS", "Testing"],
  matching: ["React", "JavaScript", "Python", "SQL"],
};

const courses = [
  { name: "TypeScript Fundamentals", platform: "Udemy", duration: "8 hours" },
  { name: "Node.js Complete Guide", platform: "Coursera", duration: "20 hours" },
  { name: "System Design Interview", platform: "YouTube", duration: "15 hours" },
  { name: "Docker & Kubernetes", platform: "Docker Official", duration: "12 hours" },
];

const ResumeSkillAnalysis = () => {
  const [uploaded, setUploaded] = useState(false);
  const matchPercentage = Math.round((skillsData.matching.length / skillsData.required.length) * 100);

  return (
    <DashboardLayout title="Resume & Skill Analysis">
      <Tabs defaultValue="resume" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="resume" className="gap-2">
            <FileText size={16} />
            Resume Analyzer
          </TabsTrigger>
          <TabsTrigger value="skills" className="gap-2">
            <BarChart3 size={16} />
            Skill Gap
          </TabsTrigger>
        </TabsList>

        {/* Resume Analyzer Tab */}
        <TabsContent value="resume" className="space-y-6">
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
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  uploaded ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                {uploaded ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 mx-auto text-primary" />
                    <p className="font-medium">resume_john_doe.pdf</p>
                    <p className="text-sm text-muted-foreground">Uploaded successfully</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">Drag & drop your resume here</p>
                      <p className="text-sm text-muted-foreground">or click to browse (PDF, DOCX)</p>
                    </div>
                    <Button variant="outline" onClick={() => setUploaded(true)}>
                      Select File
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {uploaded && (
            <>
              {/* ATS Score */}
              <Card>
                <CardHeader>
                  <CardTitle>ATS Compatibility Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          className="fill-none stroke-secondary"
                          strokeWidth="12"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          className="fill-none stroke-primary"
                          strokeWidth="12"
                          strokeDasharray={`${(mockAnalysis.score / 100) * 352} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{mockAnalysis.score}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Good Score!</h3>
                      <p className="text-muted-foreground">
                        Your resume is well-optimized for ATS systems. A few improvements can push it to excellent.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Skills Extracted */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="text-primary" />
                      Skills Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {mockAnalysis.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="text-primary" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {mockAnalysis.strengths.map((strength, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Improvements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="text-accent" />
                    Suggested Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {mockAnalysis.improvements.map((improvement, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Skill Gap Tab */}
        <TabsContent value="skills" className="space-y-6">
          {/* Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">{skillsData.existing.length}</div>
                <p className="text-muted-foreground">Your Skills</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-accent mb-2">{skillsData.required.length}</div>
                <p className="text-muted-foreground">Required Skills</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-teal/10 to-teal/5">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-teal mb-2">{skillsData.matching.length}</div>
                <p className="text-muted-foreground">Matching Skills</p>
              </CardContent>
            </Card>
          </div>

          {/* Skill Match Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="text-primary" />
                Skill Match Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Overall Match</span>
                  <span className="text-sm font-semibold">{matchPercentage}%</span>
                </div>
                <Progress value={matchPercentage} className="h-4" />
              </div>
              <p className="text-sm text-muted-foreground">
                You have {skillsData.matching.length} out of {skillsData.required.length} required skills.
                Focus on learning the missing skills to improve your placement chances.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Your Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="text-primary" />
                  Your Current Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillsData.existing.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        skillsData.matching.includes(skill)
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {skill}
                      {skillsData.matching.includes(skill) && " ✓"}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="text-destructive" />
                  Skills to Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillsData.required
                    .filter((s) => !skillsData.matching.includes(s))
                    .map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-destructive/10 text-destructive"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="text-primary" />
                Recommended Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <div
                    key={course.name}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{course.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.platform} • {course.duration}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ExternalLink size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ResumeSkillAnalysis;
