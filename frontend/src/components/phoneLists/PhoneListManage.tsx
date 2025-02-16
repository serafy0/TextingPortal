import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Paper, Title, Text, Group, Button, Stack, TextInput, Table, 
  FileButton, LoadingOverlay, Badge 
} from '@mantine/core';
import { parse } from 'papaparse';
import { z } from 'zod';
import { IconUpload, IconPlus } from '@tabler/icons-react';
import { getPhoneListWithNumbers, addPhoneNumbersToList } from '../../services/phoneListService';
import { BasicNotification as basicNotification } from '../../Helpers/NotificationHelper';

const phoneNumberSchema = z.string()
  .transform(val => {
    // Remove any leading/trailing whitespace
    val = val.trim();
    // If number starts with '1', add '0' prefix
    if (val.match(/^(1[0-2])\d{8}$/)) {
      return '0' + val;
    }
    return val;
  })
  .refine(val => /^(01[0-2])\d{8}$/.test(val), 'Invalid Egyptian phone number');

export function PhoneListManage() {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newNumber, setNewNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchList = async () => {
    try {
      const data = await getPhoneListWithNumbers(Number(id));
      setList(data);
    } catch (error) {
      basicNotification('Failed to fetch phone list');
    }
  };

  useEffect(() => {
    fetchList();
  }, [id]);

  const handleCsvUpload = async (file: File | null) => {
    if (!file) return;

    setLoading(true);
    parse(file, {
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Process all rows without requiring specific headers
          const numbers = results.data
            .map((row: any) => {
              // If row is array, take first non-empty value
              if (Array.isArray(row)) {
                return { number: String(row.find((val: any) => val && val.toString().trim()) || '').trim() };
              }
              // If row is object, take first non-empty value from any field
              if (typeof row === 'object') {
                const firstValue = Object.values(row).find(val => val && val.toString().trim());
                return { number: String(firstValue || '').trim() };
              }
              return { number: String(row).trim() };
            })
            .filter(({ number }) => number.length > 0);

          if (numbers.length === 0) {
            basicNotification('No phone numbers found in CSV');
            setLoading(false);
            return;
          }

          // Validate and transform numbers
          const validNumbers = numbers.filter(({ number }) => {
            try {
              phoneNumberSchema.parse(number);
              return true;
            } catch {
              return false;
            }
          }).map(({ number }) => ({
            number: phoneNumberSchema.parse(number)
          }));

          if (validNumbers.length === 0) {
            basicNotification('No valid Egyptian phone numbers found in CSV');
            setLoading(false);
            return;
          }

          await addPhoneNumbersToList(Number(id), validNumbers);
          basicNotification(`Added ${validNumbers.length} numbers successfully`);
          if (validNumbers.length < numbers.length) {
            basicNotification(`Skipped ${numbers.length - validNumbers.length} invalid numbers`, 'warning');
          }
          fetchList();
        } catch (error) {
          basicNotification('Failed to process numbers');
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        basicNotification(`Failed to read CSV file: ${error.message}`, 'error');
        setLoading(false);
      }
    });
  };

  const handleSingleNumberAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const validatedNumber = phoneNumberSchema.parse(newNumber);
      setLoading(true);

      await addPhoneNumbersToList(Number(id), [{ number: validatedNumber }]);
      setNewNumber('');
      basicNotification('Number added successfully');
      fetchList();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        basicNotification('Failed to add number');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredNumbers = list?.phoneNumbers.filter((phone: any) => 
    phone.number.includes(search)
  ) || [];

  return (
    <Paper p="md" pos="relative">
      <LoadingOverlay visible={loading} />
      
      <Stack>
        <Title order={2}>{list?.title} - Phone Numbers</Title>

        <Group>
          <FileButton 
            onChange={handleCsvUpload} 
            accept=".csv"
          >
            {(props) => (
              <Button {...props} leftIcon={<IconUpload size={16} />}>
                Upload CSV
              </Button>
            )}
          </FileButton>
          <Text size="sm" c="dimmed">
            Upload a CSV file with phone numbers in a single column
          </Text>
        </Group>

        <form onSubmit={handleSingleNumberAdd}>
          <Group>
            <TextInput
              placeholder="Enter Egyptian phone number"
              value={newNumber}
              onChange={(e) => setNewNumber(e.currentTarget.value)}
              error={error}
              style={{ flex: 1 }}
            />
            <Button type="submit" leftIcon={<IconPlus size={16} />}>
              Add Number
            </Button>
          </Group>
        </form>

        <TextInput
          placeholder="Search numbers..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          mb="md"
        />

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Phone Number</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredNumbers.map((phone: any) => (
              <Table.Tr key={phone.id}>
                <Table.Td>{phone.number}</Table.Td>
                <Table.Td>
                  <Badge color="green">Valid</Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Text size="sm" c="dimmed" ta="center">
          Total Numbers: {list?.phoneNumbers.length || 0}
        </Text>
      </Stack>
    </Paper>
  );
}
