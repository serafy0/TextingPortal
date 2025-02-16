import { useState } from 'react';
import { TextInput, Button, Stack } from '@mantine/core';
import { z } from 'zod';
import { createPhoneList } from '../../services/phoneListService';
import { BasicNotification as basicNotification } from '../../Helpers/NotificationHelper';

const schema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
});

interface CreatePhoneListFormProps {
  onSuccess: () => void;
}

export function CreatePhoneListForm({ onSuccess }: CreatePhoneListFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      schema.parse({ title });
      setLoading(true);

      await createPhoneList({ title });
      setTitle('');
      onSuccess();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        basicNotification('Failed to create list');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          label="List Title"
          placeholder="Enter list title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          error={error}
          data-autofocus
          required
        />

        <Button 
          type="submit" 
          loading={loading}
          fullWidth
        >
          Create List
        </Button>
      </Stack>
    </form>
  );
}
