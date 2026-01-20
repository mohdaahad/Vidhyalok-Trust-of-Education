import { Shield, Lock, Eye, FileText, Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen pt-16">
            {/* Hero Section */}
            <section className="py-20 gradient-trust">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center animate-fade-in">
                        <Shield className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
                        <h1 className="text-primary-foreground mb-6">Privacy Policy & GDPR Compliance</h1>
                        <p className="text-xl text-primary-foreground/90 leading-relaxed">
                            Your privacy is important to us. Learn how we collect, use, and protect your personal information
                            in accordance with GDPR and other privacy regulations.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Last Updated */}
                    <Card className="p-6 bg-muted/50">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-primary" />
                            <div>
                                <h3 className="font-semibold text-foreground">Last Updated</h3>
                                <p className="text-sm text-muted-foreground">January 15, 2025</p>
                            </div>
                        </div>
                    </Card>

                    {/* Information We Collect */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Information We Collect</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Personal Information</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• <strong>Name and Contact Information:</strong> Full name, email address, phone number, mailing address</li>
                                    <li>• <strong>Donation Information:</strong> Payment details, donation amounts, PAN numbers for tax certificates</li>
                                    <li>• <strong>Volunteer Information:</strong> Skills, availability, interests, and application details</li>
                                    <li>• <strong>Communication Records:</strong> Emails, phone calls, and correspondence with our organization</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Technical Information</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• <strong>Website Usage:</strong> Pages visited, time spent, click patterns, and navigation data</li>
                                    <li>• <strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                                    <li>• <strong>Cookies and Tracking:</strong> Analytics data, preferences, and session information</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* How We Use Information */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">How We Use Your Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Program Operations</h3>
                                <ul className="space-y-2 text-muted-foreground text-sm">
                                    <li>• Process donations and issue tax receipts</li>
                                    <li>• Manage volunteer applications and assignments</li>
                                    <li>• Coordinate events and community programs</li>
                                    <li>• Provide customer support and assistance</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Communication</h3>
                                <ul className="space-y-2 text-muted-foreground text-sm">
                                    <li>• Send donation confirmations and updates</li>
                                    <li>• Share impact reports and newsletters</li>
                                    <li>• Invite to events and volunteer opportunities</li>
                                    <li>• Respond to inquiries and feedback</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* Data Protection */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Data Protection & Security</h2>
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">Encryption</h3>
                                    <p className="text-sm text-muted-foreground">
                                        All sensitive data is encrypted using industry-standard protocols
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shield className="w-8 h-8 text-secondary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">Secure Storage</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Data is stored on secure servers with regular security audits
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Eye className="w-8 h-8 text-accent" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">Access Control</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Limited access to personal data on a need-to-know basis
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Your Rights */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Your Rights Under GDPR</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Access & Control</h3>
                                <ul className="space-y-2 text-muted-foreground text-sm">
                                    <li>• <strong>Right to Access:</strong> Request copies of your personal data</li>
                                    <li>• <strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                                    <li>• <strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                                    <li>• <strong>Right to Portability:</strong> Receive your data in a structured format</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Consent & Objection</h3>
                                <ul className="space-y-2 text-muted-foreground text-sm">
                                    <li>• <strong>Right to Withdraw Consent:</strong> Opt-out of communications at any time</li>
                                    <li>• <strong>Right to Object:</strong> Object to processing for marketing purposes</li>
                                    <li>• <strong>Right to Restrict:</strong> Limit how we process your data</li>
                                    <li>• <strong>Right to Complain:</strong> Lodge complaints with supervisory authorities</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* Data Sharing */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Data Sharing & Third Parties</h2>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>• <strong>Service Providers:</strong> Trusted partners who help us operate our website and process donations</li>
                                <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                                <li>• <strong>Consent:</strong> When you explicitly consent to sharing your information</li>
                                <li>• <strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
                            </ul>
                        </div>
                    </Card>

                    {/* Cookies */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Cookies & Tracking</h2>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                We use cookies and similar technologies to enhance your experience on our website:
                            </p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Required for website functionality, security, and basic features
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Analytics Cookies</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Help us understand website usage and improve user experience
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Contact Information */}
                    <Card className="p-8 bg-muted/50">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Contact Us</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Privacy Officer</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-primary" />
                                        <span className="text-muted-foreground break-all">vidhyaloktrustofeducation@gmail.com</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-primary" />
                                        <span className="text-muted-foreground">+91 9719569980</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Data Protection Authority</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    If you have concerns about how we handle your data, you can contact your local data protection authority.
                                </p>
                                <Button variant="outline" size="sm">
                                    Find Your DPA
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Updates */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Policy Updates</h2>
                        <p className="text-muted-foreground mb-4">
                            We may update this privacy policy from time to time to reflect changes in our practices or legal requirements.
                            We will notify you of any significant changes by email or through our website.
                        </p>
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                <strong>Effective Date:</strong> January 15, 2025<br />
                                <strong>Last Review:</strong> January 15, 2025<br />
                                <strong>Next Review:</strong> January 15, 2026
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;


