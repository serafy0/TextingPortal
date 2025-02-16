import { useState, useEffect } from 'react';
import { Grid, Text, Paper, TextInput, Pagination, Group, Card, Badge } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { getMessageTemplates } from '../../../services/messageTemplateService';
import classes from './TemplateSelector.module.css';

interface TemplateSelectorProps {
  onSelect: (template: any) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await getMessageTemplates({
          pageIndex: currentPage - 1,
          pageSize: 6,
          filterColumn: 'title',
          filterQuery: search,
        });
        setTemplates(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    };
    fetchTemplates();
  }, [currentPage, search]);

  return (
    <Paper p="md">
      <Text size="xl" mb="md">Select a Template</Text>
      
      <TextInput
        placeholder="Search templates..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        mb="md"
      />

      <Grid>
        {templates.map((template) => (
          <Grid.Col span={{ base: 12, sm: 6 }} key={template.id}>
            <Card 
              className={classes.templateCard}
              onClick={() => onSelect(template)}
              padding="md"
              radius="md"
              withBorder
            >
              <Card.Section p="md" className={classes.header}>
                <Group justify="space-between">
                  <Text fw={500} truncate>
                    {template.title}
                  </Text>
                  <Badge>Select</Badge>
                </Group>
              </Card.Section>

              <Text lineClamp={2} size="sm" c="dimmed" mt="sm">
                {template.body}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Group justify="center" mt="xl">
        <Pagination 
          total={totalPages} 
          value={currentPage} 
          onChange={setCurrentPage}
        />
      </Group>
    </Paper>
  );
}
