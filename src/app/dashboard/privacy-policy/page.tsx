
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPrivacyPolicyPage() {
  return (
    <main className="container mx-auto p-4 md:p-8 space-y-12">
      <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
              <div className="text-sm text-muted-foreground space-x-4">
                  <span>Effective Date: 1/9/2025</span>
                  <span>Last Updated: 1/9/2025</span>
              </div>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>LegalSphere (“we,” “our,” “us”) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our website and services at https://legalsphere.vercel.app (“Platform”).</p>
              <p>By accessing or using LegalSphere, you consent to the practices described in this Privacy Policy.</p>
              
              <h3>1. Information We Collect</h3>
              <p>We may collect the following types of information:</p>
              <ul>
                  <li><strong>Information You Provide:</strong> Name, email address, or account details (if you create an account). Messages or inputs submitted when using our AI-powered legal assistant.</li>
                  <li><strong>Automatically Collected Information:</strong> Device details (IP address, browser type, operating system). Usage data (pages visited, time spent, interactions on the Platform). Cookies and similar tracking technologies.</li>
                  <li><strong>Non-Personal Information:</strong> Aggregated and anonymized data that does not identify you directly.</li>
              </ul>

              <h3>2. How We Use Your Information</h3>
              <p>We may use your information for the following purposes:</p>
              <ul>
                  <li>To operate, maintain, and improve our Platform.</li>
                  <li>To respond to inquiries and provide customer support.</li>
                  <li>To enhance AI responses and personalize user experience.</li>
                  <li>To monitor usage patterns, prevent fraud, and ensure security.</li>
                  <li>To comply with legal obligations and enforce our Terms of Service.</li>
              </ul>

              <h3>3. AI-Generated Content Disclaimer</h3>
              <ul>
                  <li>Inputs you provide may be processed by AI systems to generate responses.</li>
                  <li>We do not store or permanently retain personal conversations unless explicitly required for debugging or research.</li>
                  <li>AI outputs may not be accurate or legally reliable—use at your own discretion.</li>
              </ul>

              <h3>4. How We Share Information</h3>
              <p>We do not sell or rent your personal data. We may share information in limited circumstances:</p>
              <ul>
                  <li><strong>Service Providers:</strong> With trusted partners who assist in hosting, analytics, or support.</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, or valid legal requests.</li>
                  <li><strong>Business Transfers:</strong> In case of a merger, acquisition, or restructuring.</li>
              </ul>

              <h3>5. Data Retention</h3>
              <ul>
                  <li>We retain personal information only for as long as necessary to provide our services or comply with legal obligations.</li>
                  <li>Non-personal and anonymized data may be stored for research or analytical purposes.</li>
              </ul>

              <h3>6. Cookies & Tracking Technologies</h3>
              <ul>
                  <li>We use cookies and similar technologies to improve functionality and analyze usage.</li>
                  <li>You may disable cookies through your browser settings, but some features may not function properly.</li>
              </ul>

              <h3>7. Data Security</h3>
              <ul>
                  <li>We implement appropriate technical and organizational measures to safeguard your information.</li>
                  <li>However, no system is 100% secure, and we cannot guarantee absolute protection against unauthorized access.</li>
              </ul>

              <h3>8. Your Rights</h3>
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul>
                  <li>Access, correct, or delete your personal data.</li>
                  <li>Withdraw consent where applicable.</li>
                  <li>Opt out of cookies or data collection (via browser or device settings).</li>
                  <li>Contact us to exercise these rights.</li>
              </ul>

              <h3>9. Children’s Privacy</h3>
              <ul>
                  <li>Our services are not intended for individuals under the age of 18.</li>
                  <li>We do not knowingly collect personal data from minors. If we discover such data has been collected, we will delete it promptly.</li>
              </ul>

              <h3>10. International Users</h3>
              <p>If you access LegalSphere from outside India, you acknowledge that your data may be processed and stored in India and other jurisdictions where our service providers operate.</p>

              <h3>11. Changes to This Privacy Policy</h3>
              <ul>
                  <li>We may update this Privacy Policy from time to time.</li>
                  <li>The “Last Updated” date at the top indicates the latest revision.</li>
                  <li>Continued use of the Platform after changes constitutes acceptance of the revised policy.</li>
              </ul>

              <h3>12. Contact Us</h3>
              <p>For any questions, concerns, or requests related to this Privacy Policy, contact us at:</p>
              <p>
                  LegalSphere Support<br />
                  📧 Email: khannawaz2004@gmail.com<br />
                  🌐 Website: https://legalsphere.vercel.app
              </p>
          </CardContent>
      </Card>
    </main>
  );
}
