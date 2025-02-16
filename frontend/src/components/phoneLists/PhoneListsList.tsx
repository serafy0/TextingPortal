import { useState, useEffect } from 'react';
import { Table, TextInput, Group, Pagination, Paper, Title, Button, Modal, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { getPhoneLists, deletePhoneList } from '../../services/phoneListService';
import { CreatePhoneListForm } from './CreatePhoneListForm';
import { useDisclosure } from '@mantine/hooks';
import { BasicNotification as basicNotification } from '../../Helpers/NotificationHelper';
import classes from './PhoneListsList.module.css';

export function PhoneListsList() {
  const [lists, setLists] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();

  const fetchLists = async () => {
    try {
      const response = await getPhoneLists({
        pageIndex: currentPage - 1,
        pageSize: 10,
        filterColumn: 'title',
        filterQuery: search,
      });
      setLists(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      basicNotification('Failed to fetch lists');
    }
  };

  useEffect(() => {
    fetchLists();
  }, [currentPage, search]);

  const handleDelete = async (id: number) => {
    try {
      await deletePhoneList(id);
      basicNotification('List deleted successfully');
      fetchLists();
    } catch {
      basicNotification('Failed to delete list');
    }
  };

  const handleCreateSuccess = () => {
    close();
    fetchLists();
    basicNotification('List created successfully');
  };

  return (
    <Paper p="md">
      <Group position="apart" mb="md">
        <Title order={2}>Phone Lists</Title>
        <Button leftIcon={<IconPlus size={16} />} onClick={open}>
          Create List
        </Button>
      </Group>

      <TextInput
        placeholder="Search lists..."
        mb="md"
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lists.map((list) => (
            <Table.Tr key={list.id} className={classes.row}>
              <Table.Td onClick={() => navigate(`/phonelists/${list.id}/manage`)}>
                {list.title}
              </Table.Td>
              <Table.Td>
                <Button
                  variant="subtle"
                  color="red"
                  size="xs"
                  onClick={() => handleDelete(list.id)}
                >
                  Delete
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="center" mt="xl">
        <Pagination
          total={totalPages}
          value={currentPage}
          onChange={setCurrentPage}
        />
      </Group>

      <Modal opened={opened} onClose={close} title="Create Phone List">
        <CreatePhoneListForm onSuccess={handleCreateSuccess} />
      </Modal>
    </Paper>
  );
}
