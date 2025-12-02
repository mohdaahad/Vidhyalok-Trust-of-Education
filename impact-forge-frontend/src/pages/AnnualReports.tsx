import { FileText, Download, Calendar, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const annualReports = [
    {
        year: "2024",
        title: "Annual Report 2024",
        description: "Comprehensive overview of our impact, financial performance, and achievements throughout 2024.",
        downloadUrl: "#",
        size: "2.4 MB",
        pages: 48,
        highlights: [
            "Served 15,000+ beneficiaries",
            "Raised $2.5M in donations",
            "Completed 25 major projects",
            "Expanded to 3 new regions"
        ]
    },
    {
        year: "2023",
        title: "Annual Report 2023",
        description: "Our journey of growth and impact in 2023, featuring key milestones and community transformations.",
        downloadUrl: "#",
        size: "2.1 MB",
        pages: 42,
        highlights: [
            "Served 12,000+ beneficiaries",
            "Raised $1.8M in donations",
            "Completed 20 major projects",
            "Launched 5 new programs"
        ]
    },
    {
        year: "2022",
        title: "Annual Report 2022",
        description: "Building resilience and hope in communities worldwide through strategic partnerships and programs.",
        downloadUrl: "#",
        size: "1.9 MB",
        pages: 38,
        highlights: [
            "Served 10,000+ beneficiaries",
            "Raised $1.2M in donations",
            "Completed 18 major projects",
            "Established 3 new partnerships"
        ]
    }
];

const financialDocuments = [
    {
        title: "Audited Financial Statements 2024",
        description: "Independent auditor's report and detailed financial statements",
        type: "Financial",
        date: "March 2025",
        downloadUrl: "#",
        size: "1.2 MB"
    },
    {
        title: "Tax Exemption Certificate",
        description: "Official documentation of our tax-exempt status",
        type: "Legal",
        date: "January 2024",
        downloadUrl: "#",
        size: "0.8 MB"
    },
    {
        title: "Form 990 (IRS Filing) 2024",
        description: "Annual information return filed with the IRS",
        type: "Compliance",
        date: "May 2025",
        downloadUrl: "#",
        size: "0.9 MB"
    },
    {
        title: "Impact Assessment Report 2024",
        description: "Detailed analysis of program effectiveness and outcomes",
        type: "Impact",
        date: "February 2025",
        downloadUrl: "#",
        size: "3.1 MB"
    }
];

const AnnualReports = () => {
    return (
        <div className="min-h-screen pt-16">
            {/* Hero Section */}
            <section className="py-20 gradient-trust">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center animate-fade-in">
                        <FileText className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
                        <h1 className="text-primary-foreground mb-6">Annual Reports & Financial Documents</h1>
                        <p className="text-xl text-primary-foreground/90 leading-relaxed">
                            Transparency is at the heart of our mission. Access our annual reports, financial statements,
                            and impact assessments to see how your support creates lasting change.
                        </p>
                    </div>
                </div>
            </section>

            {/* Reports Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <Tabs defaultValue="reports" className="w-full">
                        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
                            <TabsTrigger value="reports">Annual Reports</TabsTrigger>
                            <TabsTrigger value="financial">Financial Documents</TabsTrigger>
                        </TabsList>

                        <TabsContent value="reports" className="mt-0">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {annualReports.map((report, index) => (
                                    <Card
                                        key={report.year}
                                        className="overflow-hidden transition-smooth hover:shadow-lg hover:-translate-y-2 animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <Badge variant="secondary">{report.year}</Badge>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <FileText className="w-4 h-4" />
                                                    <span>{report.pages} pages</span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-foreground mb-3">{report.title}</h3>
                                            <p className="text-muted-foreground text-sm mb-4">{report.description}</p>

                                            <div className="space-y-2 mb-6">
                                                {report.highlights.map((highlight, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                                        <TrendingUp className="w-4 h-4 text-primary" />
                                                        <span className="text-muted-foreground">{highlight}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-sm text-muted-foreground">
                                                    Size: {report.size}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                    {report.year}
                                                </div>
                                            </div>

                                            <Button variant="default" className="w-full group" asChild>
                                                <a href={report.downloadUrl} download>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download Report
                                                </a>
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="financial" className="mt-0">
                            <div className="grid md:grid-cols-2 gap-8">
                                {financialDocuments.map((doc, index) => (
                                    <Card
                                        key={doc.title}
                                        className="p-6 transition-smooth hover:shadow-lg animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <Badge variant="outline">{doc.type}</Badge>
                                            <div className="text-sm text-muted-foreground">
                                                {doc.date}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-foreground mb-3">{doc.title}</h3>
                                        <p className="text-muted-foreground text-sm mb-4">{doc.description}</p>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-sm text-muted-foreground">
                                                Size: {doc.size}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <DollarSign className="w-4 h-4" />
                                                <span>Financial Document</span>
                                            </div>
                                        </div>

                                        <Button variant="outline" className="w-full group" asChild>
                                            <a href={doc.downloadUrl} download>
                                                <Download className="w-4 h-4 mr-2" />
                                                Download Document
                                            </a>
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Transparency Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Our Commitment to Transparency</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Financial Accountability</h3>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li>• Annual independent audits by certified public accountants</li>
                                        <li>• Detailed financial statements published quarterly</li>
                                        <li>• 95% of donations go directly to programs</li>
                                        <li>• Administrative costs kept below 5%</li>
                                        <li>• Regular board oversight and governance</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Impact Measurement</h3>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li>• Regular impact assessments and evaluations</li>
                                        <li>• Third-party verification of program outcomes</li>
                                        <li>• Beneficiary feedback and testimonials</li>
                                        <li>• Real-time project tracking and updates</li>
                                        <li>• Annual stakeholder surveys and reports</li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 gradient-warm">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-accent-foreground mb-6">Questions About Our Reports?</h2>
                        <p className="text-xl text-accent-foreground/90 mb-8 leading-relaxed">
                            Our team is available to answer any questions about our financial performance,
                            impact metrics, or organizational governance.
                        </p>
                        <Button variant="hero" size="lg" asChild>
                            <a href="/contact">Contact Our Finance Team</a>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AnnualReports;


