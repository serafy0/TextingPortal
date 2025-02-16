import { Card, Text, Menu, ActionIcon, Group } from '@mantine/core';
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import classes from './MessageTemplateCard.module.css';

interface CardProps {
  template: {
    id: number;
    title: string;
    body: string;
  };
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: number, selected: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MessageTemplateCard({
  template,
  selectable,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: CardProps) {
  return (
    <Card 
      className={classes.card} 
      data-selected={selected}
      onClick={() => selectable && onSelect?.(template.id, !selected)}
    >
      <Card.Section className={classes.header}>
        <Group justify="space-between">
          <Text fw={500} truncate>
            {template.title}
          </Text>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEdit size={14} />} onClick={onEdit}>
                Edit
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconTrash size={14} />} 
                onClick={onDelete}
                color="red"
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      <Text lineClamp={3} size="sm" c="dimmed" mt="sm">
        {template.body}
      </Text>
    </Card>
  );
}
