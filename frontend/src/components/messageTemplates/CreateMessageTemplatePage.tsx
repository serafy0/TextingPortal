import React from 'react';
import { MessageTemplateForm } from './MessageTemplateForm';

export function CreateMessageTemplatePage() {
  return (
    <>
      <h2>Create Message Template</h2>
      <MessageTemplateForm 
        onSuccess={(data) => {
          // Redirect or update UI upon successful creation
          console.log('Template created', data);
        }}
      />
    </>
  );
}
