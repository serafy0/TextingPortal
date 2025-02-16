import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageTemplateForm } from './MessageTemplateForm';

export function EditMessageTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <>
      <h2>Edit Message Template</h2>
      <MessageTemplateForm 
        templateId={Number(id)} 
        onSuccess={() => {
          navigate('/templates');
        }}
      />
    </>
  );
}
