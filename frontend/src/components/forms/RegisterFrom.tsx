'use client';

import { useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import {
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Notification,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import classes from './auth.module.css';
import { BasicNotification } from '../../Helpers/NotificationHelper';

// Define the registration validation schema using Zod
const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export function RegisterForm() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate: zodResolver(registerSchema),
  });

  const handleSubmit = async (values: { email: string; username: string; password: string }) => {
    setError(null);
    setLoading(true);
    try {
      await registerUser(values.email, values.username, values.password);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Create your account
        </Title>
        
        {error && (
          <Notification color="red" onClose={() => setError(null)} mb="md">
            {error}
          </Notification>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Username"
            placeholder="Your username"
            size="md"
            {...form.getInputProps('username')}
          />
          <TextInput
            label="Email address"
            placeholder="you@example.com"
            size="md"
            mt="md"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...form.getInputProps('password')}
          />
          <Button fullWidth mt="xl" size="md" type="submit" loading={loading}>
            Register
          </Button>
          <Text ta="center" mt="md">
            Already have an account?{' '}
            <Anchor href="/login" fw={700}>
              Login
            </Anchor>
          </Text>
        </form>
      </Paper>
    </div>
  );
}
