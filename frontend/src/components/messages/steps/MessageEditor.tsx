import { useState } from 'react';
import { Textarea, Text, Grid, Card, Badge, Transition, Group, ThemeIcon, Paper } from '@mantine/core';
import { IconTemplate, IconMessage } from '@tabler/icons-react';
import { z } from 'zod';
import classes from './MessageEditor.module.css';

const messageSchema = z.string()
  .min(1, 'Message cannot be empty')
  .max(1600, 'Message must not exceed 1600 characters')
  .refine(msg => msg.trim().length > 0, 'Message cannot be only spaces');

interface MessageEditorProps {
  initialValue: string;
  onSave: (message: string) => void;
  onError: () => void;
  template: any;
}

export function MessageEditor({ initialValue, onSave, onError, template }: MessageEditorProps) {
  const [message, setMessage] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setMessage(value);
    
    try {
      messageSchema.parse(value);
      setError(null);
      onSave(value);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        onError();
      }
    }
  };

  return (
    <Grid gutter="xl">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder radius="md" className={classes.editorCard}>
          <Card.Section withBorder inheritPadding py="xs">
            <Group>
              <ThemeIcon variant="light" size={30}>
                <IconTemplate size={18} />
              </ThemeIcon>
              <div>
                <Text fw={500}>Template: {template?.title}</Text>
                <Text size="xs" c="dimmed">Edit your message below</Text>
              </div>
            </Group>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <Textarea
              value={message}
              onChange={(e) => handleChange(e.currentTarget.value)}
              minRows={8}
              maxLength={1600}
              error={error}
              classNames={{ input: classes.textarea }}
              placeholder="Type your message here..."
            />
          </Card.Section>

          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Badge color={error ? "red" : "green"}>
                {error ? "Invalid" : "Valid"}
              </Badge>
              <Text size="sm" c={message.length > 1500 ? "red" : "dimmed"}>
                {message.length}/1600 characters
              </Text>
            </Group>
          </Card.Section>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder radius="md" className={classes.previewCard}>
          <Card.Section withBorder inheritPadding py="xs">
            <Group>
              <ThemeIcon variant="light" size={30}>
                <IconMessage size={18} />
              </ThemeIcon>
              <Text fw={500}>Preview</Text>
            </Group>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <Paper className={classes.previewContent}>
              <Text className={classes.previewText}>
                {message}
              </Text>
            </Paper>
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
