import { useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import {
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Progress,
  Group,
  Text,
  TextInput,
  Title,
  Notification,
  Box,
  Center,
  Divider
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import classes from './auth.module.css';

// Updated registration schema with new password requirements
const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .refine((val) => /[0-9]/.test(val), {
      message: 'Password must include a number',
    })
    .refine((val) => /[a-z]/.test(val), {
      message: 'Password must include a lowercase letter',
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Password must include an uppercase letter',
    })
    .refine((val) => /[$&+,:;=?@#|'<>.^*()%!-]/.test(val), {
      message: 'Password must include a special symbol',
    }),
});

// --- Password strength meter components

import { IconCheck, IconX } from '@tabler/icons-react';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <IconCheck size={14} stroke={1.5} /> : <IconX size={14} stroke={1.5} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;
  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });
  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

function PasswordStrengthMeter({ value }: { value: string }) {
  const strength = getStrength(value);
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        key={index}
        styles={{ section: { transitionDuration: '0ms' } }}
        value={
          value.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
        }
        color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
        size={4}
      />
    ));
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
  ));

  return (
    <div>
      <Group gap={5} grow mt="xs" mb="md">
        {bars}
      </Group>
      <PasswordRequirement label="Has at least 6 characters" meets={value.length > 5} />
      {checks}
    </div>
  );
}

// --- End Password strength meter components

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
          {/* Password input with strength meter integration */}
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...form.getInputProps('password')}
          />
          {form.values.password.length > 0 && (
            <PasswordStrengthMeter value={form.values.password} />
          )}
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