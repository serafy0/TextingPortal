import React, { useEffect, useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { TextInput, Textarea, Button, Group, Paper, Title } from '@mantine/core';
import { z } from 'zod';
import { getMessageTemplate, createMessageTemplate, updateMessageTemplate } from '../../services/messageTemplateService';
import { BasicNotification as basicNotification } from '../../Helpers/NotificationHelper'; // assumed import

const schema = z.object({
	title: z.string().min(1, { message: 'Title is required' }).max(100),
	body: z.string().min(1, { message: 'Body is required' }).max(1600),
});

interface MessageTemplateFormProps {
  templateId?: number;
  onSuccess?: (data: any) => void;
}

export function MessageTemplateForm({ templateId, onSuccess }: MessageTemplateFormProps) {
  const form = useForm({
    initialValues: { title: '', body: '' },
    validate: zodResolver(schema),
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (templateId) {
      setLoading(true);
      getMessageTemplate(templateId)
        .then(data => {
          form.setValues({
            title: data.title,
            body: data.body,
          });
        })
        .catch(() => basicNotification('Error loading template'))
        .finally(() => setLoading(false));
    }
  }, [templateId]);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      if (templateId) {
        await updateMessageTemplate(templateId, { title: values.title, body: values.body });
        basicNotification('Template updated');
      } else {
        await createMessageTemplate({ title: values.title, body: values.body });
        basicNotification('Template created');
      }
      onSuccess && onSuccess(values);
    } catch {
      basicNotification('Error saving template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" shadow="xs">
      <Title order={3}>Message Template Form</Title>
      <TextInput label="Title" placeholder="Enter title" mt="md" {...form.getInputProps('title')} />
      <Textarea label="Body" placeholder="Enter body" mt="md" {...form.getInputProps('body')} />
      <Group mt="md">
        <Button onClick={() => form.onSubmit(handleSubmit)()} loading={loading}>
          {templateId ? 'Update' : 'Create'}
        </Button>
      </Group>
    </Paper>
  );
}
