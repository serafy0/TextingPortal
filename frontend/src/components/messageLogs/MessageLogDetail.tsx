import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Title, Text, Table, TextInput, Button, Group, Badge, Stack, ThemeIcon } from '@mantine/core';
import { IconSearch, IconDownload, IconFileTypePdf, IconCheck, IconX } from '@tabler/icons-react';
import { unparse } from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getMessageLogDetail, MessageLogDetail } from '../../services/messageLogsService';

export function MessageLogDetailView() {
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<MessageLogDetail | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLog = async () => {
      if (id) {
        try {
          const data = await getMessageLogDetail(Number(id));
          setLog(data);
        } catch (error) {
          console.error('Failed to fetch log:', error);
        }
      }
    };
    fetchLog();
  }, [id]);

  const filteredMessages = useMemo(() => {
    if (!log) return [];
    return log.messages.filter(msg => 
      msg.to.toLowerCase().includes(search.toLowerCase()) ||
      msg.errorMessage?.toLowerCase().includes(search.toLowerCase())
    );
  }, [log, search]);

  const handleExport = () => {
    if (!log) return;
    
    const csv = unparse({
      fields: ['id', 'to', 'sent', 'dateCreated', 'errorCode', 'errorMessage'],
      data: log.messages
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `message-log-${log.id}.csv`;
    link.click();
  };

  const handleExportPDF = () => {
    if (!log) return;

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Message Log Details', 14, 15);
    
    // Add message body
    doc.setFontSize(12);
    doc.text('Message:', 14, 25);
    const splitMessage = doc.splitTextToSize(log.parsedBody, 180);
    doc.text(splitMessage, 14, 35);

    // Add messages table
    const tableData = log.messages.map(msg => [
      msg.to,
      msg.sent ? 'Sent' : 'Failed',
      new Date(msg.dateCreated).toLocaleString(),
      msg.errorMessage || '-'
    ]);

    (doc as any).autoTable({
      startY: 35 + (splitMessage.length * 7),
      head: [['To', 'Status', 'Date', 'Error']],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    doc.save(`message-log-${log.id}.pdf`);
  };

  if (!log) return null;

  return (
    <Paper p="md">
      <Stack >
        <Title order={2}>Message Log Detail</Title>
        
        <Text size="lg">Message: {log.parsedBody}</Text>

        <Group  mb="md">
          <TextInput
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Group>
            <Button 
              leftSection={<IconDownload size={16} />}
              onClick={handleExport}
              variant="light"
            >
              Export CSV
            </Button>
            <Button 
              leftSection={<IconFileTypePdf size={16} />}
              onClick={handleExportPDF}
              color="red"
            >
              Export PDF
            </Button>
          </Group>
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>To</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Error</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredMessages.map((msg) => (
              <Table.Tr key={msg.id}>
                <Table.Td>{msg.to}</Table.Td>
                <Table.Td>
                  <ThemeIcon 
                    color={msg.sent ? 'green' : 'red'} 
                    variant="light" 
                    size="md"
                    radius="xl"
                  >
                    {msg.sent ? <IconCheck size={16} /> : <IconX size={16} />}
                  </ThemeIcon>
                </Table.Td>
                <Table.Td>{new Date(msg.dateCreated).toLocaleString()}</Table.Td>
                <Table.Td>{msg.errorMessage || '-'}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Paper>
  );
}
