import { useState, useEffect } from 'react';
import { Paper, Text, Grid, TextInput, Pagination, Group, Stack, Checkbox, Loader, Card, ThemeIcon, Title } from '@mantine/core';
import { IconSearch, IconAddressBook } from '@tabler/icons-react';
import { getPhoneLists } from '../../../services/phoneListService';
import { BasicNotification as basicNotification } from '../../../Helpers/NotificationHelper';
import classes from './PhoneListSelector.module.css';

interface PhoneListSelectorProps {
  selectedLists: any[];
  onSelectionChange: (lists: any[]) => void;
}

export function PhoneListSelector({ selectedLists, onSelectionChange }: PhoneListSelectorProps) {
  const [lists, setLists] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        const response = await getPhoneLists({
          pageIndex: currentPage - 1,
          pageSize: 9, // Show more items per page
          filterColumn: 'title',
          filterQuery: search,
        });
        setLists(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to fetch lists:', error);
        basicNotification('Failed to load phone lists');
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, [currentPage, search]);

  const handleToggle = (list: any) => {
    const isSelected = selectedLists.some(l => l.id === list.id);
    if (isSelected) {
      onSelectionChange(selectedLists.filter(l => l.id !== list.id));
    } else {
      onSelectionChange([...selectedLists, list]);
    }
  };

  return (
    <Paper p="xl">
      <Stack>
        <Group justify="center" mb="lg">
          <ThemeIcon size={42} radius="md">
            <IconAddressBook size={24} />
          </ThemeIcon>
          <Title order={2}>Select Recipient Lists</Title>
        </Group>

        <TextInput
          size="md"
          placeholder="Search lists..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

        {loading ? (
          <Group justify="center" p="xl">
            <Loader size="xl" />
          </Group>
        ) : lists.length === 0 ? (
          <Text c="dimmed" ta="center" p="xl" size="lg">
            No lists found
          </Text>
        ) : (
          <Grid>
            {lists.map((list) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={list.id}>
                <Card 
                  withBorder
                  className={classes.listCard}
                  onClick={() => handleToggle(list)}
                  data-selected={selectedLists.some(l => l.id === list.id)}
                >
                  <Group >
                    <Text fw={500} size="lg">{list.title}</Text>
                    <Checkbox
                      checked={selectedLists.some(l => l.id === list.id)}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}

        {totalPages > 1 && (
          <Group justify="center" mt="xl">
            <Pagination 
              total={totalPages} 
              value={currentPage} 
              onChange={setCurrentPage}
              size="lg"
            />
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
