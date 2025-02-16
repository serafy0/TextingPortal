import React from 'react';
import { AppShell, Burger, Group, Text, Code, ScrollArea } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import { IconGauge, IconNotes, IconMessage, IconHistory, IconAddressBook } from '@tabler/icons-react';
import { useAuth } from '../../Context/useAuth';
import { NavbarLinksGroup } from './NavbarLinksGroup/NavbarLinksGroup';
import UserMenu from './UserMenu';
import classes from './DashboardLayout.module.css';

export function DashboardLayout() {
  const [opened, { toggle }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { user } = useAuth();

  const navigationData = [
    { 
      label: 'Dashboard', 
      icon: IconGauge,
      link: '/dashboard'
    },
    {
      label: 'Message Templates',
      icon: IconNotes,
      roles: ['Admin'],
      links: [
        { label: 'View All Templates', link: '/templates' },
        { label: 'Create Template', link: '/template/create' },
      ],
    },
    {
      label: 'Messages',
      icon: IconMessage,
      roles: ['Admin', 'Sender'],
      links: [
        { label: 'Send Messages', link: '/messages/send' },
      ],
    },
    {
      label: 'Message Logs',
      icon: IconHistory,
      roles: ['Admin', 'Sender', 'Viewer'],
      links: [
        { label: 'View All Logs', link: '/logs' },
      ],
    },
    {
      label: 'Phone Lists',
      icon: IconAddressBook,
      roles: ['Admin'],
      links: [
        { label: 'View All Lists', link: '/phonelists' },
      ],
    },
  ];

  const filteredNavigation = navigationData.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || '');
  });

  const links = filteredNavigation.map((item) => (
    <NavbarLinksGroup {...item} key={item.label} />
  ));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: { base: 300 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text gradient={{ from: 'indigo', to: 'cyan', deg: 45 }} fw={700} size="lg">
              SMS Portal
            </Text>
          </Group>
          <Group>
            <Code fw={700}>v1.0.0</Code>
            {!isMobile && <UserMenu />}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className={classes.navbar}>
        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>{links}</div>
        </ScrollArea>
        {isMobile && (
          <div className={classes.footer}>
            <UserMenu />
          </div>
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}