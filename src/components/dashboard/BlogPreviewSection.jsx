
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Rss, ExternalLink, AlertTriangle, Loader2, Calendar } from 'lucide-react';

const BLOG_URL = 'https://yoursuccesscoach.blog';
const BLOG_FEED_URL = 'https://yoursuccesscoach.blog/rss.xml';
const CORS_PROXY_URL = 'https://api.rss2json.com/v1/api.json?rss_url=';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const truncateText = (text, charLimit = 200) => {
  if (!text) return '';
  const plainText = text.replace(/<[^>]+>/g, '');
  if (plainText.length <= charLimit) return plainText;
  return plainText.substr(0, charLimit).trim() + '...';
};

const BlogPreviewSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${CORS_PROXY_URL}${encodeURIComponent(BLOG_FEED_URL)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        if (data.status !== 'ok') throw new Error('Invalid feed data');

        const parsedArticles = data.items.slice(0, 3).map(item => ({
          title: item.title,
          link: item.link,
          pubDate: formatDate(item.pubDate),
          description: truncateText(item.description || item.content),
        }));

        setArticles(parsedArticles);
      } catch (err) {
        console.error('Blog feed error:', err);
        setError('Unable to load blog articles at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="mt-8" 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
    >
      <h3 className="text-2xl font-semibold mb-6 flex items-center text-foreground">
        <Rss className="h-6 w-6 mr-3 text-primary" />
        Latest from Our Blog
      </h3>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Loading latest articles...</p>
        </div>
      )}

      {error && !loading && (
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <p className="text-muted-foreground">New articles coming soon. Visit <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">yoursuccesscoach.blog</a> for more insights.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && articles.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
        >
          {articles.map((article, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full flex flex-col bg-card/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader className="space-y-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {article.pubDate}
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-sm line-clamp-3">
                    {article.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-transparent hover:bg-primary/10"
                  >
                    <a 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      Read More <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div 
        className="text-center mt-8" 
        variants={itemVariants}
      >
        <Button 
          asChild 
          variant="default" 
          size="lg" 
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <a 
            href={BLOG_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center"
          >
            See All Articles <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default BlogPreviewSection;