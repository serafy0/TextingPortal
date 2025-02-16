import { Paper, Text, Group, Stack, Card, Container, Title } from '@mantine/core';
import { IconTemplate, IconList } from '@tabler/icons-react';
import classes from './MessagePreview.module.css';

interface MessagePreviewProps {
  template: any;
  messageBody: string;
  selectedLists: any[];
  onSend?: () => void; // Make this optional since we'll handle send in parent
}

export function MessagePreview({ template, messageBody, selectedLists }: MessagePreviewProps) {
  return (
    <Container size="xl">
      <Stack spacing="xl">
        <Title ta="center" className={classes.title}>Review Your Message</Title>

        <Card withBorder radius="md" className={classes.card}>
          <Card.Section withBorder inheritPadding py="xs" className={classes.section}>
            <Group position="apart">
              <Group>
                <IconTemplate size={20} />
                <Text fw={500}>Template</Text>
              </Group>
              <Text c="dimmed">{template?.title}</Text>
            </Group>
          </Card.Section>

          <Card.Section withBorder inheritPadding py="lg" className={classes.section}>
            <Stack spacing="xs">
              <Text fw={500}>Message</Text>
              <Text className={classes.message}>{messageBody}</Text>
            </Stack>
          </Card.Section>

          <Card.Section withBorder inheritPadding py="xs" className={classes.section}>
            <Stack spacing="xs">
              <Group>
                <IconList size={20} />
                <Text fw={500}>Selected Lists</Text>
              </Group>
              {selectedLists.map(list => (
                <Text key={list.id} size="sm">• {list.title}</Text>
              ))}
            </Stack>
          </Card.Section>
        </Card>
      </Stack>
    </Container>
  );
}
