import React from 'react';
import { Menu, Button, Avatar, Group, Text } from '@mantine/core';
import { useAuth } from '../../Context/useAuth';
import { IconChevronDown, IconHeart, IconStar, IconMessage, IconSettings, IconSwitchHorizontal, IconLogout, IconPlayerPause, IconTrash } from '@tabler/icons-react';
const UserMenu = () => {
    const { user, logout } = useAuth();

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button variant="subtle">
                    <Group gap={4}>
                        <Avatar
                            
                            alt={user?.username || 'User'}
                            radius="xl"
                            size={24}
                        />
                        <Text size="sm">{user?.username || 'User'}</Text>
                        <IconChevronDown size={16} />
                    </Group>
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />} onClick={logout}>
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};



export default UserMenu;
