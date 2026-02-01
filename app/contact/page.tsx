'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const ways = [
    {
      title: 'Report Food Waste',
      description: 'See food being wasted in your community? Let us know and we\'ll work to rescue it.',
      icon: '🚨',
      action: 'Report Now',
      category: 'report-waste',
    },
    {
      title: 'Volunteer',
      description: 'Help with food pickup, distribution events, or community outreach programs.',
      icon: '🤝',
      action: 'Sign Up to Volunteer',
      category: 'volunteer',
    },
    {
      title: 'Become a Partner',
      description: 'Restaurants, farms, or businesses? Join as a food partner and list your surplus.',
      icon: '🏪',
      action: 'Partner With Us',
      category: 'partner',
    },
    {
      title: 'Donate',
      description: 'Fund meal vouchers, sponsor food packs, or support our operations.',
      icon: '💝',
      action: 'Make a Donation',
      category: 'donate',
    },
    {
      title: 'Educational Partnership',
      description: 'Schools and organizations can partner with us for food security programs.',
      icon: '🎓',
      action: 'Explore Partnership',
      category: 'education-partner',
    },
    {
      title: 'Spread Awareness',
      description: 'Share our mission, educate others, and help grow the movement.',
      icon: '📢',
      action: 'Get Resources',
      category: 'awareness',
    },
  ];

  const resources = [
    {
      title: 'Food Waste Reduction Guide',
      description: 'Practical tips for reducing food waste at home and work',
      type: 'PDF Guide',
      size: '2.4 MB',
    },
    {
      title: 'Community Organizer Toolkit',
      description: 'Everything you need to start a food rescue program',
      type: 'PDF Toolkit',
      size: '5.1 MB',
    },
    {
      title: 'Educational Posters',
      description: 'Printable materials for schools and community centers',
      type: 'ZIP File',
      size: '8.3 MB',
    },
  ];

  const contactInfo = [
    { label: 'Email', value: 'hello@ecoeats.org', icon: '📧' },
    { label: 'Phone', value: '+234 800 ECO-EATS', icon: '📞' },
    { label: 'Address', value: 'Lagos, Nigeria', icon: '📍' },
    { label: 'Hours', value: 'Mon-Fri: 9AM - 6PM WAT', icon: '⏰' },
  ];

  return (
    <div className="page-shell">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Get Involved</p>
          <h1 className="text-4xl sm:text-5xl text-[var(--foreground)]">
            Join the movement to end hunger and reduce food waste.
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            There are many ways to get involved with EcoEats. Whether you want to report waste, volunteer, 
            partner with us, or simply learn more—we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Ways to Get Involved */}
      <section className="section-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)]">Ways to get involved</h2>
            <p className="text-[var(--muted-foreground)] mt-3">Choose how you want to make an impact.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ways.map((way) => (
              <Card key={way.title} hover>
                <CardHeader>
                  <div className="text-4xl mb-3">{way.icon}</div>
                  <CardTitle className="text-lg">{way.title}</CardTitle>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">{way.description}</p>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setFormData({ ...formData, category: way.category, subject: way.title });
                      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {way.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24" id="contact-form">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)]">Send us a message</h2>
            <p className="text-[var(--muted-foreground)] mt-3">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          <Card>
            <CardContent className="pt-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
                    Thank you for reaching out!
                  </h3>
                  <p className="text-[var(--muted-foreground)]">
                    We've received your message and will respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      What is this about? *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <option value="">Select a category</option>
                      <option value="report-waste">Report Food Waste</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="partner">Become a Partner</option>
                      <option value="donate">Donation Inquiry</option>
                      <option value="education-partner">Educational Partnership</option>
                      <option value="awareness">Spread Awareness</option>
                      <option value="general">General Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="nominate">Nominate Someone for Spotlight</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      placeholder="Brief subject of your message"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Info & Resources */}
      <section className="section-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Contact Information</h3>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {contactInfo.map((info) => (
                    <div key={info.label} className="flex items-start gap-3">
                      <div className="text-2xl">{info.icon}</div>
                      <div>
                        <p className="text-sm text-[var(--muted-foreground)]">{info.label}</p>
                        <p className="text-[var(--foreground)] font-medium">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Educational Resources */}
            <div>
              <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Educational Resources</h3>
              <div className="space-y-4">
                {resources.map((resource) => (
                  <Card key={resource.title}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-[var(--foreground)] mb-1">
                            {resource.title}
                          </h4>
                          <p className="text-sm text-[var(--muted-foreground)] mb-2">{resource.description}</p>
                          <div className="flex gap-2 text-xs text-[var(--muted-foreground)]">
                            <span>{resource.type}</span>
                            <span>•</span>
                            <span>{resource.size}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-[var(--primary)] text-white border-none shadow-[var(--shadow)]">
            <CardContent className="py-12">
              <h2 className="text-3xl sm:text-4xl mb-4">Stay updated on our mission</h2>
              <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto mb-8">
                Subscribe to our newsletter for monthly updates, success stories, and tips on reducing food waste.
              </p>
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button size="lg" variant="secondary" className="whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
