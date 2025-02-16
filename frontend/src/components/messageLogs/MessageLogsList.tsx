import { useState, useEffect } from 'react';
import { Table, TextInput, Group, Pagination, Paper, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconSearch } from '@tabler/icons-react';
import { getMessageLogs } from '../../services/messageLogsService';
import classes from './MessageLogsList.module.css';

export function MessageLogsList() {
  const [logs, setLogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      const response = await getMessageLogs({
        pageIndex: currentPage - 1,
        pageSize: 10,
        sortColumn,
        sortOrder,
        filterColumn: 'parsedBody',
        filterQuery: search,
      });
      setLogs(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, search, sortColumn, sortOrder]);

  const handleSort = (column: string) => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    setSortColumn(column);
  };

  return (
    <Paper p="md">
      <Title order={2} mb="lg">Message Logs</Title>

      <TextInput
        placeholder="Search messages..."
        mb="md"
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Message</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {logs.map((log) => (
            <Table.Tr 
              key={log.id} 
              className={classes.row}
              onClick={() => navigate(`/logs/${log.id}`)}
            >
              <Table.Td>{log.id}</Table.Td>
              <Table.Td>{log.parsedBody}</Table.Td>
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
    </Paper>
  );
}
