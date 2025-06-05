
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <Card className="bg-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Effective Date: 1st June 2025</p>

          <div className="space-y-6">
            <p>
              Welcome to yoursuccesscoach.online. Your privacy is important to us. This Privacy Policy explains how we collect,
              use, and protect your information when you use our Web App for meditation, your mood entries, and inner dialogue coaching.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-primary">1. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal Information: We collect your name and email during sign-up or guest login.</li>
                <li>Mood Data: If you use the mood tracker, we store your mood inputs to help personalize your experience.</li>
                <li>Analytics Data: We use basic analytics to understand how users interact with the app (e.g., page visits, time spent).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide you with access to meditation, mood entries, and the coaching content.</li>
                <li>To improve your experience using mood and usage data.</li>
                <li>To communicate updates or respond to support requests (if provided).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">3. Data Protection</h2>
              <p>
                We use standard security measures to protect your data. Your information is not shared with third parties
                for marketing or any commercial purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">4. Cookies</h2>
              <p>We may use cookies to store login sessions and enhance user experience.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">5. Your Rights</h2>
              <p>
                You may request to delete your data or account by contacting us at{' '}
                <a href="mailto:support@yoursuccesscoach.online" className="text-primary hover:text-accent">
                  support@yoursuccesscoach.online
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">6. Changes</h2>
              <p>
                We may update this Privacy Policy. We'll notify users through the app if significant changes are made.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, write to us at{' '}
                <a href="mailto:support@yoursuccesscoach.online" className="text-primary hover:text-accent">
                  support@yoursuccesscoach.online
                </a>
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PrivacyPolicyPage;