import { FileText, Scale, Shield, AlertTriangle, Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
    return (
        <div className="min-h-screen pt-16">
            {/* Hero Section */}
            <section className="py-20 gradient-trust">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center animate-fade-in">
                        <Scale className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
                        <h1 className="text-primary-foreground mb-6">Terms of Service</h1>
                        <p className="text-xl text-primary-foreground/90 leading-relaxed">
                            Please read these terms carefully before using our website and services.
                            By accessing or using Vidhyalok Trust of Education's services, you agree to be bound by these terms.
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

                    {/* Acceptance of Terms */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">1. Acceptance of Terms</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                By accessing and using the Vidhyalok Trust of Education website and related services,
                                you accept and agree to be bound by the terms and provision of this agreement.
                            </p>
                            <p>
                                If you do not agree to abide by the above, please do not use this service. These terms apply
                                to all visitors, users, donors, volunteers, and others who access or use the service.
                            </p>
                        </div>
                    </Card>

                    {/* Use License */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">2. Use License</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Permitted Uses</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• Browse and view content for personal, non-commercial purposes</li>
                                    <li>• Make donations to support our charitable programs</li>
                                    <li>• Register as a volunteer and participate in our programs</li>
                                    <li>• Share our content on social media with proper attribution</li>
                                    <li>• Contact us for legitimate inquiries and support</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Prohibited Uses</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• Use the website for any unlawful purpose or to solicit unlawful acts</li>
                                    <li>• Violate any international, federal, provincial, or state regulations or laws</li>
                                    <li>• Transmit or procure the sending of any advertising or promotional material</li>
                                    <li>• Impersonate or attempt to impersonate Vidhyalok Trust of Education or its employees</li>
                                    <li>• Engage in any conduct that restricts or inhibits anyone's use of the website</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* Donations and Payments */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">3. Donations and Payments</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Donation Terms</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• All donations are voluntary and non-refundable unless otherwise stated</li>
                                    <li>• Donations are used to support Vidhyalok Trust of Education's charitable programs</li>
                                    <li>• We reserve the right to refuse any donation at our discretion</li>
                                    <li>• Tax receipts will be provided for eligible donations as per applicable laws</li>
                                    <li>• Recurring donations can be cancelled at any time through your account</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Payment Processing</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• Payment processing is handled by secure third-party providers</li>
                                    <li>• We do not store credit card information on our servers</li>
                                    <li>• All payment information is encrypted and protected</li>
                                    <li>• You are responsible for ensuring payment information is accurate</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* Volunteer Services */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">4. Volunteer Services</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                By registering as a volunteer, you agree to:
                            </p>
                            <ul className="space-y-2">
                                <li>• Provide accurate and complete information in your application</li>
                                <li>• Follow all safety guidelines and instructions provided</li>
                                <li>• Maintain confidentiality of sensitive information</li>
                                <li>• Represent Vidhyalok Trust of Education professionally and ethically</li>
                                <li>• Complete assigned tasks to the best of your ability</li>
                                <li>• Notify us immediately of any changes in your availability</li>
                            </ul>
                            <p>
                                Vidhyalok Trust of Education reserves the right to terminate volunteer relationships at any time
                                for violation of these terms or for any other reason deemed necessary.
                            </p>
                        </div>
                    </Card>

                    {/* Intellectual Property */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">5. Intellectual Property Rights</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                The service and its original content, features, and functionality are and will remain
                                the exclusive property of Vidhyalok Trust of Education and its licensors. The service is protected
                                by copyright, trademark, and other laws.
                            </p>
                            <p>
                                Our trademarks and trade dress may not be used in connection with any product or service
                                without our prior written consent. You may not reproduce, distribute, modify, create
                                derivative works of, publicly display, publicly perform, republish, download, store,
                                or transmit any of our material.
                            </p>
                        </div>
                    </Card>

                    {/* Privacy and Data */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">6. Privacy and Data Protection</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                Your privacy is important to us. Our Privacy Policy explains how we collect, use,
                                and protect your information when you use our service. By using our service, you
                                agree to the collection and use of information in accordance with our Privacy Policy.
                            </p>
                            <p>
                                We comply with applicable data protection laws, including GDPR, and implement
                                appropriate security measures to protect your personal information.
                            </p>
                        </div>
                    </Card>

                    {/* Disclaimers */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">7. Disclaimers and Limitations</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Service Availability</h3>
                                    <p className="text-muted-foreground">
                                        The information on this website is provided on an "as is" basis. We make no
                                        warranties, expressed or implied, and hereby disclaim all other warranties including,
                                        without limitation, implied warranties or conditions of merchantability, fitness
                                        for a particular purpose, or non-infringement of intellectual property.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Limitation of Liability</h3>
                                <p className="text-muted-foreground">
                                    In no event shall Vidhyalok Trust of Education, nor its directors, employees, partners, agents,
                                    suppliers, or affiliates, be liable for any indirect, incidental, special, consequential,
                                    or punitive damages, including without limitation, loss of profits, data, use, goodwill,
                                    or other intangible losses, resulting from your use of the service.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Indemnification */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">8. Indemnification</h2>
                        <p className="text-muted-foreground">
                            You agree to defend, indemnify, and hold harmless Vidhyalok Trust of Education and its licensee and
                            licensors, and their employees, contractors, agents, officers and directors, from and
                            against any and all claims, damages, obligations, losses, liabilities, costs or debt,
                            and expenses (including but not limited to attorney's fees).
                        </p>
                    </Card>

                    {/* Termination */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">9. Termination</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                We may terminate or suspend your account and bar access to the service immediately,
                                without prior notice or liability, under our sole discretion, for any reason whatsoever
                                and without limitation, including but not limited to a breach of the Terms.
                            </p>
                            <p>
                                If you wish to terminate your account, you may simply discontinue using the service
                                or contact us to request account deletion.
                            </p>
                        </div>
                    </Card>

                    {/* Governing Law */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">10. Governing Law</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                These Terms shall be interpreted and governed by the laws of the United States,
                                without regard to its conflict of law provisions. Our failure to enforce any right
                                or provision of these Terms will not be considered a waiver of those rights.
                            </p>
                            <p>
                                If any provision of these Terms is held to be invalid or unenforceable by a court,
                                the remaining provisions of these Terms will remain in effect.
                            </p>
                        </div>
                    </Card>

                    {/* Changes to Terms */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">11. Changes to Terms</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at
                                any time. If a revision is material, we will provide at least 30 days notice prior
                                to any new terms taking effect.
                            </p>
                            <p>
                                What constitutes a material change will be determined at our sole discretion. By
                                continuing to access or use our service after those revisions become effective,
                                you agree to be bound by the revised terms.
                            </p>
                        </div>
                    </Card>

                    {/* Contact Information */}
                    <Card className="p-8 bg-muted/50">
                        <h2 className="text-2xl font-bold text-foreground mb-6">12. Contact Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">Legal Department</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-primary" />
                                        <span className="text-muted-foreground">legal@vidhyaloktrust.org</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-primary" />
                                        <span className="text-muted-foreground">+1 (555) 123-4567</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">General Inquiries</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-primary" />
                                        <span className="text-muted-foreground">info@vidhyaloktrust.org</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        For questions about these terms or our services
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Acknowledgment */}
                    <Card className="p-8 bg-primary/5 border-primary/20">
                        <div className="flex items-start gap-3">
                            <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Acknowledgment</h3>
                                <p className="text-muted-foreground">
                                    By using our service, you acknowledge that you have read and understood these Terms
                                    of Service and agree to be bound by them. If you do not agree to these terms,
                                    please do not use our service.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;


