
"use client";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 md:p-8 space-y-12 mt-20">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
                <div className="text-sm text-muted-foreground space-x-4">
                    <span>Effective Date: 1/9/2025</span>
                    <span>Last Updated: 1/9/2025</span>
                </div>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>Welcome to LegalSphere (“we,” “our,” “us”). These Terms of Service (“Terms”) govern your access to and use of our website, services, and tools available at https://legalsphere.vercel.app (the “Platform”). By accessing or using LegalSphere, you agree to these Terms. If you do not agree, you may not use our services.</p>

                <h3>1. Eligibility</h3>
                <p>You must be at least 18 years old or the age of majority in your jurisdiction to use this Platform.</p>
                <p>By using our services, you represent that you have the legal capacity to enter into these Terms.</p>

                <h3>2. Nature of Services</h3>
                <p>LegalSphere provides AI-driven legal information and resources for educational and informational purposes only.</p>
                <p>We are not a law firm, nor do we provide legal representation, legal advice, or attorney-client relationships.</p>
                <p>Any information provided is general guidance and should not replace professional advice from a qualified lawyer.</p>

                <h3>3. User Responsibilities</h3>
                <p>You agree to use LegalSphere only for lawful purposes and in compliance with all applicable laws.</p>
                <p>You will not:</p>
                <ul>
                    <li>Use the Platform for fraudulent, harmful, or unlawful activities.</li>
                    <li>Misrepresent your identity or affiliation.</li>
                    <li>Interfere with the operation or security of the Platform.</li>
                </ul>

                <h3>4. Account & Access</h3>
                <p>Certain features may require you to create an account. You are responsible for maintaining the confidentiality of your login details.</p>
                <p>You are liable for all activities under your account. Notify us immediately of unauthorized use.</p>

                <h3>5. Intellectual Property</h3>
                <p>All content on LegalSphere (design, text, software, logos, trademarks, AI outputs, etc.) is owned or licensed by us.</p>
                <p>You are granted a limited, non-exclusive, non-transferable right to use the Platform for personal, non-commercial purposes.</p>
                <p>You may not copy, modify, distribute, reverse engineer, or exploit our content without prior written consent.</p>

                <h3>6. AI-Generated Content Disclaimer</h3>
                <p>Outputs provided by our AI systems are generated automatically and may contain inaccuracies.</p>
                <p>We do not guarantee the completeness, reliability, or accuracy of any AI-generated responses.</p>
                <p>You acknowledge that reliance on AI-generated content is at your own risk.</p>

                <h3>7. Third-Party Links</h3>
                <p>Our Platform may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of third-party sites.</p>
                <p>Accessing third-party websites is at your own discretion and risk.</p>

                <h3>8. Limitation of Liability</h3>
                <p>To the maximum extent permitted by law:</p>
                <ul>
                    <li>We are not liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of LegalSphere.</li>
                    <li>We are not responsible for losses, claims, or damages resulting from reliance on AI-generated content.</li>
                    <li>Your sole remedy for dissatisfaction with our services is to discontinue using the Platform.</li>
                </ul>

                <h3>9. Indemnification</h3>
                <p>You agree to indemnify and hold harmless LegalSphere, its founders, affiliates, partners, and employees from any claims, damages, liabilities, or expenses (including legal fees) arising from:</p>
                <ul>
                    <li>Your use or misuse of the Platform.</li>
                    <li>Violation of these Terms.</li>
                    <li>Violation of applicable laws or third-party rights.</li>
                </ul>

                <h3>10. Termination</h3>
                <p>We may suspend or terminate your access to the Platform at any time, without prior notice, for violation of these Terms.</p>
                <p>Upon termination, your right to use the Platform ceases immediately.</p>

                <h3>11. Modifications</h3>
                <p>We reserve the right to update or modify these Terms at any time.</p>
                <p>Updates will be effective once posted on this page with a revised “Last Updated” date.</p>
                <p>Continued use of the Platform after modifications constitutes acceptance of the updated Terms.</p>

                <h3>12. Governing Law & Jurisdiction</h3>
                <p>These Terms shall be governed by and construed in accordance with the laws of India.</p>
                <p>Any disputes shall be subject to the exclusive jurisdiction of the courts located in Kolkata, India.</p>

                <h3>13. Contact Information</h3>
                <p>If you have any questions about these Terms, you may contact us at:</p>
                <p>
                    LegalSphere Support<br />
                    📧 Email: khannawaz2004@gmail.com<br />
                    🌐 Website: https://legalsphere.vercel.app
                </p>
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
