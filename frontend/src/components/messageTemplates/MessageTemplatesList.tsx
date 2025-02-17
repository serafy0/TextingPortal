import { useState, useEffect } from 'react';
import { Grid, TextInput, Select, Paper, Group, Pagination, Modal, Button, Text, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconAlertTriangle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { getMessageTemplates, deleteMessageTemplate } from '../../services/messageTemplateService';
import { MessageTemplateCard } from './MessageTemplateCard';
import { MessageTemplateForm } from './MessageTemplateForm';
import {BasicNotification as  basicNotification } from '../../Helpers/NotificationHelper';

interface ListProps {
  selectable?: boolean;
  senderMode?: boolean;
  onTemplateSelect?: (template: any) => void;
  onSelectionChange?: (selectedIds: number[]) => void;
}

export function MessageTemplatesList({ 
  selectable = false, 
  onSelectionChange 
}: ListProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);

  const fetchTemplates = async () => {
    try {
      const response = await getMessageTemplates({
        pageIndex: currentPage - 1,
        pageSize: 9,
        sortColumn: sortBy,
        sortOrder: sortOrder,
        filterColumn: 'title',
        filterQuery: search,
      });
      setTemplates(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [currentPage, search, sortBy, sortOrder]);

  const handleSelect = (id: number, selected: boolean) => {
    const newSelectedIds = selected
      ? [...selectedIds, id]
      : selectedIds.filter(selectedId => selectedId !== id);
    
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMessageTemplate(id);
      basicNotification('Template deleted successfully');
      fetchTemplates();
    } catch (error) {
      basicNotification('Error deleting template');
    }
    closeDelete();
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    openDelete();
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    openEdit();
  };

  const handleEditSuccess = () => {
    closeEdit();
    fetchTemplates();
  };

  // const handleCardClick = (template: any) => {
  //   if (senderMode && onTemplateSelect) {
  //     onTemplateSelect(template);
  //   }
  // };

  return (
    <Paper p="md">
      <Group mb="md">
        <Group>
          <TextInput
            placeholder="Search templates..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Select
            value={sortBy}
            onChange={(value) => setSortBy(value || 'title')}
            data={[
              { value: 'title', label: 'Title' },
              { value: 'body', label: 'Body' },
            ]}
            placeholder="Sort by"
          />
          <Select
            value={sortOrder}
            onChange={(value) => setSortOrder(value || 'asc')}
            data={[
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' },
            ]}
          />
        </Group>
      </Group>

      <Grid>
        {templates.map((template) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={template.id}>
            <MessageTemplateCard
              template={template}
              selectable={selectable}
              selected={selectedIds.includes(template.id)}
              onSelect={handleSelect}
              onEdit={() => handleEdit(template.id)}
              onDelete={() => confirmDelete(template.id)}
            />
          </Grid.Col>
        ))}
      </Grid>

      <Group justify="center" mt="xl">
        <Pagination total={totalPages} value={currentPage} onChange={setCurrentPage} />
      </Group>

      <Modal 
        opened={deleteModalOpened} 
        onClose={closeDelete}
        title="Confirm Deletion"
        centered
      >
        <Stack>
          <Group>
            <IconAlertTriangle size={24} color="red" />
            <Text>Are you sure you want to delete this template?</Text>
          </Group>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDelete}>Cancel</Button>
            <Button 
              color="red" 
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={editModalOpened} onClose={closeEdit} title="Edit Template">
        <MessageTemplateForm
          templateId={editingId || undefined}
          onSuccess={handleEditSuccess}
        />
      </Modal>
    </Paper>
  );
}
