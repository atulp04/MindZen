
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const TermsOfServicePage = () => {
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
            Terms of Service
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Effective Date: May 9, 2025</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-primary">1. Introduction</h2>
              <p>
                Welcome to our Emotional Healing Web App. By accessing or using our services, you agree to be bound by these Terms of Service.
                Please read them carefully.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">2. Services Provided</h2>
              <p>
                This platform provides users with guided meditations, inner dialogue coaching tools, audio/video resources,
                and a mood tracker to support emotional wellness and personal growth.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">3. User Access</h2>
              <p>
                You may access the app as a registered user or as a guest using the provided login credentials.
                Please do not share your access with unauthorized users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">4. Content Usage</h2>
              <p>
                All audio, video, and written content on the site is protected by intellectual property laws.
                You may not copy, redistribute, or modify any material without prior permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">5. Mood Tracker and Analytics</h2>
              <p>
                Our app includes optional mood tracking and analytics to help you monitor your emotional well-being.
                This data is used to enhance user experience and remains confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">6. Changes to the Service</h2>
              <p>
                We reserve the right to update, modify, or discontinue features (such as adding/removing meditations or podcasts)
                at our discretion. We will make reasonable efforts to notify users of major changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">7. Limitation of Liability</h2>
              <p>
                Our app is intended for wellness support and does not replace professional medical or psychological advice.
                We are not liable for any health outcomes resulting from use of the app.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">8. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to the app at any time if these Terms are violated
                or misuse is detected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary">9. Contact Us</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at{' '}
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

export default TermsOfServicePage;