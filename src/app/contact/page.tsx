import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
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
          <p className="text-xl text-muted-foreground">
            Ready to start your learning journey? I'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <a 
                      href="mailto:vishva.mohan@gmail.com"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      vishva.mohan@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-3">What I Offer</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• JEE (Advanced/Main) Physics preparation</li>
                  <li>• NEET Physics coaching</li>
                  <li>• Science and Math for grades 8+</li>
                  <li>• SAT preparation</li>
                  <li>• Statement of Purpose (SoP) guidance</li>
                  <li>• College admission counseling</li>
                </ul>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Response Time</h3>
                <p className="text-muted-foreground">
                  I typically respond to inquiries within 24 hours. For urgent matters, 
                  please mention "URGENT" in your subject line.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="jee-coaching">JEE Coaching Inquiry</option>
                    <option value="neet-coaching">NEET Physics Coaching</option>
                    <option value="sat-prep">SAT Preparation</option>
                    <option value="sop-guidance">SoP Guidance</option>
                    <option value="general-inquiry">General Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Please describe your learning goals, current academic level, and any specific questions you have..."
                    required
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  By submitting this form, you agree to be contacted regarding your inquiry.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}