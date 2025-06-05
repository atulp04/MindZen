import React, { useState, useEffect } from 'react';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
    import { Users, BarChart2, Settings, PlusCircle, Edit, Trash2, Search, Music, Clock, Globe, ListFilter } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';

    const MEDITATION_SESSIONS_KEY = 'mindzen_meditation_sessions';
    const initialSessions = [
      { id: 'ms1', title: "Sunrise Meditation", duration: "10 min", language: "EN", category: "Mindfulness", audio_file_url: "https://example.com/sunrise.mp3", created_at: new Date().toISOString() },
      { id: 'ms2', title: "Relaxing Waves", duration: "15 min", language: "ES", category: "Instrumental", audio_file_url: "https://example.com/waves.mp3", created_at: new Date().toISOString() },
    ];

    const meditationCategories = ["Quick Pranayama", "Body Scan", "Mindfulness", "Muscle Relaxation", "Instrumental", "Guided Imagery", "Affirmations"];
    const languages = ["EN", "ES", "FR", "DE", "HI", "N/A"];


    const AdminPage = () => {
      const [sessions, setSessions] = useState([]);
      const [searchTerm, setSearchTerm] = useState('');
      const [editingSession, setEditingSession] = useState(null);
      const [isFormOpen, setIsFormOpen] = useState(false);
      const { toast } = useToast();

      useEffect(() => {
        const storedSessions = localStorage.getItem(MEDITATION_SESSIONS_KEY);
        if (storedSessions) {
          setSessions(JSON.parse(storedSessions));
        } else {
          setSessions(initialSessions);
          localStorage.setItem(MEDITATION_SESSIONS_KEY, JSON.stringify(initialSessions));
        }
      }, []);

      const saveSessionsToLocalStorage = (updatedSessions) => {
        localStorage.setItem(MEDITATION_SESSIONS_KEY, JSON.stringify(updatedSessions));
        setSessions(updatedSessions);
      };

      const handleFormSubmit = (formData) => {
        let updatedSessions;
        if (editingSession) {
          updatedSessions = sessions.map(s => s.id === editingSession.id ? { ...s, ...formData, id: s.id, created_at: s.created_at } : s);
          toast({ title: "Session Updated!", description: `"${formData.title}" has been successfully updated.` });
        } else {
          const newSession = { ...formData, id: `ms${Date.now()}`, created_at: new Date().toISOString() };
          updatedSessions = [...sessions, newSession];
          toast({ title: "Session Added!", description: `"${formData.title}" has been successfully added.` });
        }
        saveSessionsToLocalStorage(updatedSessions);
        setIsFormOpen(false);
        setEditingSession(null);
      };

      const handleDeleteSession = (sessionId) => {
        const sessionToDelete = sessions.find(s => s.id === sessionId);
        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        saveSessionsToLocalStorage(updatedSessions);
        toast({ title: "Session Deleted!", description: `"${sessionToDelete?.title}" has been removed.`, variant: "destructive" });
      };

      const openEditForm = (session) => {
        setEditingSession(session);
        setIsFormOpen(true);
      };
      
      const openNewForm = () => {
        setEditingSession(null);
        setIsFormOpen(true);
      };

      const filteredSessions = sessions.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <div className="animate-fade-in space-y-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground">Manage MindZen application content and users.</p>
          </motion.div>

          <SessionFormDialog
            isOpen={isFormOpen}
            setIsOpen={setIsFormOpen}
            onSubmit={handleFormSubmit}
            session={editingSession}
            key={editingSession ? editingSession.id : 'new'} 
          />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="shadow-xl hover:shadow-2xl transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center"><Music className="h-6 w-6 mr-2 text-primary" />Meditation Sessions</CardTitle>
                    <CardDescription>Add, edit, or remove meditation sessions.</CardDescription>
                  </div>
                  <Button onClick={openNewForm} className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                    <PlusCircle className="mr-2 h-5 w-5" /> Add New Session
                  </Button>
                </div>
                <div className="mt-4 relative">
                  <Input
                    type="text"
                    placeholder="Search sessions by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {filteredSessions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead className="hidden sm:table-cell">Duration</TableHead>
                        <TableHead className="hidden lg:table-cell">Language</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">{session.title}</TableCell>
                          <TableCell className="hidden md:table-cell">{session.category}</TableCell>
                          <TableCell className="hidden sm:table-cell">{session.duration}</TableCell>
                          <TableCell className="hidden lg:table-cell">{session.language}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditForm(session)} className="hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the session "{session.title}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteSession(session.id)} className="bg-destructive hover:bg-destructive/90">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>A list of all meditation sessions.</TableCaption>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No sessions found matching your search criteria, or no sessions added yet.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <AdminActionCard icon={<Users className="h-8 w-8 text-primary" />} title="User Management" description="View and manage user accounts and roles." actionText="Manage Users" onClick={() => toast({title: "Coming Soon!", description: "User management features are under development."})} delay={0.3} />
            <AdminActionCard icon={<BarChart2 className="h-8 w-8 text-accent" />} title="Analytics" description="View application usage statistics." actionText="View Analytics" onClick={() => toast({title: "Coming Soon!", description: "Analytics dashboard is under development."})} delay={0.4} />
            <AdminActionCard icon={<Settings className="h-8 w-8 text-primary" />} title="App Settings" description="Configure global application settings." actionText="Configure Settings" onClick={() => toast({title: "Coming Soon!", description: "Application settings page is under development."})} delay={0.5} />
          </div>
        </div>
      );
    };

    const SessionFormDialog = ({ isOpen, setIsOpen, onSubmit, session }) => {
      const [title, setTitle] = useState('');
      const [duration, setDuration] = useState('');
      const [language, setLanguage] = useState('');
      const [category, setCategory] = useState('');
      const [audioUrl, setAudioUrl] = useState('');
      const { toast } = useToast();

      useEffect(() => {
        if (session) {
          setTitle(session.title);
          setDuration(session.duration);
          setLanguage(session.language);
          setCategory(session.category);
          setAudioUrl(session.audio_file_url);
        } else {
          setTitle('');
          setDuration('');
          setLanguage('');
          setCategory('');
          setAudioUrl('');
        }
      }, [session, isOpen]);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !duration || !language || !category || !audioUrl) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Please fill all fields to add or update a session." });
            return;
        }
        onSubmit({ title, duration, language, category, audio_file_url: audioUrl });
        setIsOpen(false); 
      };
      
      const handleOpenChange = (open) => {
        if (!open) {
          setIsOpen(false); 
        }
      };

      return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{session ? 'Edit Meditation Session' : 'Add New Meditation Session'}</DialogTitle>
              <DialogDescription>
                {session ? 'Update the details for this session.' : 'Fill in the details for the new session.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right col-span-1">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" placeholder="e.g., Morning Focus" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right col-span-1">Duration</Label>
                <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="col-span-3" placeholder="e.g., 10 min" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="language" className="text-right col-span-1">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right col-span-1">Category</Label>
                 <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {meditationCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="audioUrl" className="text-right col-span-1">Audio URL</Label>
                <Input id="audioUrl" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} className="col-span-3" placeholder="https://example.com/audio.mp3" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">{session ? 'Save Changes' : 'Add Session'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };
    
    const AdminActionCard = ({ icon, title, description, actionText, onClick, delay }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        <Card className="h-full flex flex-col justify-between hover:shadow-xl transition-shadow">
          <CardHeader>
             <div className="mb-3 p-2 bg-primary/10 rounded-full w-fit">{icon}</div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onClick} className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              {actionText}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );

    export default AdminPage;