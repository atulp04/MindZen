import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, BookOpen, Languages, MessageSquare } from 'lucide-react';
import InnerDialogueCard from '@/components/selftalk/InnerDialogueCard';
import { professionalsDialogues, studentsDialogues } from '@/components/selftalk/selfTalkUtils';

const SectionRenderer = ({ title, dialogues, sectionType, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="mb-12"
  >
    <h2 className="text-3xl font-semibold mb-6 flex items-center">
      <Icon className={`h-8 w-8 mr-3 ${sectionType === 'professionals' ? 'text-primary' : 'text-accent'}`} />
      {title}
    </h2>
    <Tabs defaultValue="english" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mb-6">
        <TabsTrigger value="english">
          <Languages className="h-4 w-4 mr-2" /> English
        </TabsTrigger>
        <TabsTrigger value="marathi">
          <Languages className="h-4 w-4 mr-2" /> Marathi
        </TabsTrigger>
      </TabsList>
      <TabsContent value="english">
        {dialogues.english.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dialogues.english.map((dialogue, index) => (
              <InnerDialogueCard key={dialogue.id} dialogue={dialogue} index={index} sectionType={sectionType} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No English dialogues available in this section yet.</p>
        )}
      </TabsContent>
      <TabsContent value="marathi">
        {dialogues.marathi.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dialogues.marathi.map((dialogue, index) => (
              <InnerDialogueCard key={dialogue.id} dialogue={dialogue} index={index} sectionType={sectionType} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">या विभागात मराठी संवाद अद्याप उपलब्ध नाहीत.</p>
        )}
      </TabsContent>
    </Tabs>
  </motion.div>
);

const InnerDialoguesLibraryPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 md:mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Inner Dialogues Library
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
          Empower your inner voice. Explore guided audio sessions for professionals and students to foster positive self-reflection and growth.
        </p>
      </motion.div>

      <SectionRenderer 
        title="For Professionals" 
        dialogues={professionalsDialogues} 
        sectionType="professionals"
        icon={Briefcase}
      />
      
      <SectionRenderer 
        title="For Students" 
        dialogues={studentsDialogues} 
        sectionType="students"
        icon={BookOpen}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-16 text-center bg-card p-6 md:p-8 rounded-xl shadow-xl"
      >
        <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">The Power of Inner Dialogue</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Your inner dialogues, or self-talk, profoundly shape your internal world and external reality. They are influenced by your subconscious mind and reveal your deepest thoughts, beliefs, and attitudes. Cultivating positive and constructive inner dialogues can significantly enhance performance, emotional well-being, and overall life satisfaction. These sessions are meticulously designed to guide you towards a more supportive, empowering, and resilient inner voice.
        </p>
      </motion.div>
    </div>
  );
};

export default InnerDialoguesLibraryPage;