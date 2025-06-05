
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send, User } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: JSON.stringify({
          name,
          from: email,
          subject: subject || 'Contact Form Submission',
          message,
          to: 'support@yoursuccesscoach.online'
        })
      });

      if (error) throw error;

      toast({
        title: "Message Sent Successfully! 🎉",
        description: "Thank you for reaching out. We'll get back to you soon.",
        duration: 5000,
      });

      // Clear form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Message Not Sent",
        description: "There was an error sending your message. Please try again later.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-2xl"
    >
      <Card className="bg-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Contact Us
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Have questions or feedback? We'd love to hear from you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Your Name *
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Your Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject (optional)</Label>
              <Input
                id="subject"
                placeholder="What's this about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <textarea
                id="message"
                className="w-full min-h-[150px] rounded-md border bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Send className="h-5 w-5" />
              </motion.div>
            ) : (
              <Send className="mr-2 h-5 w-5" />
            )}
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ContactPage;