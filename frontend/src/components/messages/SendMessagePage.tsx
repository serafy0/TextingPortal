import { useState } from 'react';
import { Stepper, Button, Group, Box } from '@mantine/core';
import { IconTemplate, IconEdit, IconSend, IconClipboardCheck, IconCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { TemplateSelector } from './steps/TemplateSelector';
import { MessageEditor } from './steps/MessageEditor';
import { PhoneListSelector } from './steps/PhoneListSelector';
import { MessagePreview } from './steps/MessagePreview';
import { sendMessageToLists } from '../../services/messageService';
import {BasicNotification as basicNotification } from '../../Helpers/NotificationHelper';
import { z } from 'zod';
import { useMediaQuery } from '@mantine/hooks';

interface SendMessageResponse {
  message: string;
  id: number;
}

export function SendMessagePage() {
  const [active, setActive] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [messageBody, setMessageBody] = useState('');
  const [messageValid, setMessageValid] = useState(false);
  const [selectedPhoneLists, setSelectedPhoneLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const canProceedToStep2 = selectedTemplate !== null;
  const canProceedToStep3 = messageValid;
  const canProceedToStep4 = selectedPhoneLists.length > 0;

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setMessageBody(template.body);
    
    // Validate the template message
    try {
      const messageSchema = z.string()
        .min(1, 'Message cannot be empty')
        .max(1600, 'Message must not exceed 1600 characters')
        .refine(msg => msg.trim().length > 0, 'Message cannot be only spaces');
      
      messageSchema.parse(template.body);
      setMessageValid(true);
      // Only navigate if validation passes
      setActive(1);
    } catch {
      setMessageValid(false);
    }
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      const response = await sendMessageToLists({
        phoneNumListIds: selectedPhoneLists.map(list => list.id),
        messageBody,
        messageTemplateId: selectedTemplate.id
      });
      const result = response.data as SendMessageResponse;
      basicNotification('Message sent successfully');
      // Navigate to the message log detail page
      navigate(`/logs/${result.id}`);
    } catch (error) {
      basicNotification('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p="xl">
      <Stepper 
        active={active} 
        onStepClick={setActive} 
        allowNextStepsSelect={false}
        orientation={isMobile ? 'vertical' : 'horizontal'}
      >
        <Stepper.Step
          label="Select Template"
          description="Choose a message template"
          icon={<IconTemplate size="1.1rem" />}
        >
          <TemplateSelector onSelect={handleTemplateSelect} />
        </Stepper.Step>

        <Stepper.Step
          label="Edit Message"
          description="Customize your message"
          icon={<IconEdit size="1.1rem" />}
        >
          <MessageEditor
            initialValue={messageBody}
            onSave={(newBody) => {
              setMessageBody(newBody);
              setMessageValid(true);
            }}
            onError={() => setMessageValid(false)}
            template={selectedTemplate}
          />
        </Stepper.Step>

        <Stepper.Step
          label="Select Recipients"
          description="Choose recipient lists"
          icon={<IconSend size="1.1rem" />}
        >
          <PhoneListSelector
            selectedLists={selectedPhoneLists}
            onSelectionChange={setSelectedPhoneLists}
          />
        </Stepper.Step>

        <Stepper.Step
          label="Review"
          description="Review and send"
          icon={<IconClipboardCheck size="1.1rem" />}
        >
          <MessagePreview
            template={selectedTemplate}
            messageBody={messageBody}
            selectedLists={selectedPhoneLists}
          />
        </Stepper.Step>
      </Stepper>

      <Group justify="center" mt="xl">
        {active > 0 && (
          <Button variant="default" onClick={() => setActive(current => current - 1)}>
            Back
          </Button>
        )}
        
        {active < 3 && (
          <Button 
            onClick={() => setActive(current => current + 1)}
            disabled={
              (active === 0 && !canProceedToStep2) ||
              (active === 1 && !canProceedToStep3) ||
              (active === 2 && !canProceedToStep4)
            }
          >
            Next step
          </Button>
        )}
        
        {active === 3 && (
          <Button 
            onClick={handleSend} 
            color="green"
            leftSection={<IconSend size={18} />}
            loading={loading}
            size="lg"
          >
            Send Message
          </Button>
        )}
      </Group>
    </Box>
  );
}
