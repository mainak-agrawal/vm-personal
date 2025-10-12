import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Vishva Mohan for coaching and mentoring inquiries.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
            Contact Me
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Contact Information */}
          <Card className="shadow-xl">
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Email</h3>
                    <a 
                      href="mailto:vishva.mohan@gmail.com"
                      className="text-lg text-primary hover:text-primary/80 transition-colors"
                    >
                      vishva.mohan@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-3">Get in Touch for</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• JEE (Advanced/Main) Physics preparation</li>
                  <li>• NEET Physics coaching</li>
                  <li>• Doubt clearing for JEE/NEET Physics</li>
                  <li>• Science and Math for grades 8+</li>
                  <li>• SAT preparation*</li>
                  <li>• Statement of Purpose (SoP) guidance*</li>
                  <li>• College admission counseling*</li>
                </ul>
                <p className="text-sm text-muted-foreground/70 mt-3">
                  * Currently not offered
                </p>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Physics Doubts</h3>
                <p className="text-muted-foreground">
                  If you are facing difficulty with a specific problem/concept during your JEE/NEET preparation, Email me the problem. I will send you a paper/video solution, or offer you a (FREE) Zoom Session to discuss and solve the problem and associated concepts.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}