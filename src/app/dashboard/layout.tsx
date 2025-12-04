
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, MessageSquare, User as UserIcon, PlusCircle, Car, Building, Briefcase, Users, Shield, Landmark, Search, Settings, Moon, Sun, Trash2, Home, PanelLeft, Info } from 'lucide-react';
import { Logo } from '@/components/Logo';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/hooks/useTheme';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useChatHistory } from '@/hooks/useChatHistory';
import { v4 as uuidv4 } from 'uuid';
import { useLocale } from '@/contexts/LocaleContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUserData } from '@/services/user-data';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { AboutDialog } from '@/components/dashboard/AboutDialog';
import { useSidebar } from '@/components/ui/sidebar';

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const { chats, deleteChat } = useChatHistory();
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const { isMobile, setOpenMobile } = useSidebar();


  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    } else if (user) {
        const fetchUserData = async () => {
            const data = await getUserData(user.uid);
            if(data) {
                setProfilePictureUrl(data.profilePictureUrl || '');
                setUserInitial(data.fullName ? data.fullName.charAt(0).toUpperCase() : user.email!.charAt(0).toUpperCase());
            } else {
                setUserInitial(user.email!.charAt(0).toUpperCase());
            }
        };
        fetchUserData();
    }
  }, [user, loading, router]);

  const handleNewChat = () => {
    router.push('/dashboard/chat/new');
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleMobileNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    e.preventDefault();
    deleteChat(chatId);
    if (pathname.includes(chatId)) {
        router.push('/dashboard/chat/new');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const encodedQuery = encodeURIComponent(searchQuery);
    router.push(`/dashboard/chat/new?q=${encodedQuery}`);
    setSearchQuery('');
     if (isMobile) {
      setOpenMobile(false);
    }
  };


  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
            <div className="flex items-center justify-between">
                <div className="group-data-[collapsible=icon]:hidden">
                    <Link href="/dashboard/chat/new" onClick={handleMobileNavClick}>
                        <Logo />
                    </Link>
                </div>
                <SidebarTrigger />
            </div>
        </SidebarHeader>
        <SidebarContent className="p-0 flex flex-col">
          <div className="p-2">
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton variant="outline" className="w-full justify-start" onClick={handleNewChat} tooltip={t('newChat')}>
                        <PlusCircle />
                        <span>{t('newChat')}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </div>

          <SidebarSeparator />
          
          <ScrollArea className="flex-1">
            <div className="p-2">
                <p className="text-xs font-semibold text-muted-foreground p-2 group-data-[collapsible=icon]:hidden">{t('savedChats')}</p>
                <SidebarMenu>
                {chats.length > 0 ? (
                    chats.map((chat) => (
                    <ContextMenu key={chat.id}>
                        <SidebarMenuItem>
                            <ContextMenuTrigger>
                                <SidebarMenuButton asChild isActive={pathname.includes(chat.id)} tooltip={chat.title}>
                                   <Link href={`/dashboard/chat/${chat.id}`} onClick={handleMobileNavClick} className="flex items-center justify-between w-full">
                                     <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                                        <MessageSquare />
                                        <span className="truncate flex-1">{chat.title}</span>
                                     </div>
                                   </Link>
                                </SidebarMenuButton>
                            </ContextMenuTrigger>
                        </SidebarMenuItem>
                        <ContextMenuContent>
                           <ContextMenuItem onClick={(e: any) => handleDeleteChat(e, chat.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete chat
                           </ContextMenuItem>
                        </ContextMenuContent>
                     </ContextMenu>
                    ))
                ) : (
                    <div className="p-2 text-sm text-center text-muted-foreground group-data-[collapsible=icon]:hidden">
                    {t('noSavedChats')}
                    </div>
                )}
                </SidebarMenu>
            </div>
          </ScrollArea>

          <SidebarSeparator />

          <div className="p-2">
            <p className="text-xs font-semibold text-muted-foreground p-2 group-data-[collapsible=icon]:hidden">{t('quickLegalTopics')}</p>
            <SidebarMenu>
              <SidebarMenuItem key="traffic-laws">
                <SidebarMenuButton asChild tooltip={t('trafficLaws')}>
                  <Link href={`/dashboard/chat/new?q=${encodeURIComponent("Give me a general overview of Traffic Laws in India")}`} onClick={handleMobileNavClick}>
                    <Car />
                    <span>{t('trafficLaws')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="property-rights">
                <SidebarMenuButton asChild tooltip={t('propertyRights')}>
                  <Link href={`/dashboard/chat/new?q=${encodeURIComponent("Give me a general overview of Property Rights in India")}`} onClick={handleMobileNavClick}>
                    <Building />
                    <span>{t('propertyRights')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="employment-laws">
                <SidebarMenuButton asChild tooltip={t('employmentLaws')}>
                  <Link href={`/dashboard/chat/new?q=${encodeURIComponent("Give me a general overview of Employment Laws in India")}`} onClick={handleMobileNavClick}>
                    <Briefcase />
                    <span>{t('employmentLaws')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="family-laws">
                <SidebarMenuButton asChild tooltip={t('familyLaws')}>
                  <Link href={`/dashboard/chat/new?q=${encodeURIComponent("Give me a general overview of Family Laws in India")}`} onClick={handleMobileNavClick}>
                    <Users />
                    <span>{t('familyLaws')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="consumer-protection">
                <SidebarMenuButton asChild tooltip={t('consumerProtection')}>
                  <Link href={`/dashboard/chat/new?q=${encodeURIComponent("Give me a general overview of Consumer Protection Laws in India")}`} onClick={handleMobileNavClick}>
                    <Shield />
                    <span>{t('consumerProtection')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem key="constitutional-rights">
                <SidebarMenuButton asChild tooltip={t('constitutionalRights')}>
                  <Link href={`/dashboard/chat/new?q=${encodeURIComponent("Give me a general overview of Constitutional Rights in India")}`} onClick={handleMobileNavClick}>
                    <Landmark />
                    <span>{t('constitutionalRights')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
        <SidebarSeparator />
         <SidebarFooter className='items-start p-2 flex-col'>
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard/account'} tooltip={t('account')}>
                        <Link href="/dashboard/account" onClick={handleMobileNavClick}>
                        <UserIcon />
                        <span>{t('account')}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings'} tooltip={t('settings')}>
                        <Link href="/dashboard/settings" onClick={handleMobileNavClick}>
                        <Settings />
                        <span>{t('settings')}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          <div className="flex flex-col items-start gap-2 text-center w-full p-2 group-data-[collapsible=icon]:hidden">
            <span className="text-sm text-muted-foreground truncate">{user.email}</span>
             <Button variant="outline" className="w-full justify-center" onClick={logout}>
                <LogOut className="mr-2" />
                {t('logout')}
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden"/>
                <form onSubmit={handleSearchSubmit} className="relative flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder={t('searchPlaceholder')}
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>
            <div className='flex items-center gap-2'>
                <Select value={locale} onValueChange={(value) => setLocale(value as any)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder={t('language')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिन्दी</SelectItem>
                        <SelectItem value="bn">বাংলা</SelectItem>
                        <SelectItem value="ta">தமிழ்</SelectItem>
                        <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                    </SelectContent>
                </Select>
                <AboutDialog>
                    <Button variant="ghost" size="icon">
                        <Info />
                    </Button>
                </AboutDialog>
                <ThemeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={profilePictureUrl} alt={userInitial}/>
                            <AvatarFallback>{userInitial}</AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{t('myAccount')}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/account"><UserIcon className="mr-2 h-4 w-4" />{t('profile')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4" />{t('settings')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('logout')}
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
        <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
    </ThemeProvider>
  )
}
