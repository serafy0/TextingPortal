import { Paper, Title } from '@mantine/core';

export function Dashboard() {

      return (  
            <Paper style={{ maxWidth: '450px', margin: '0 auto', paddingTop: 80 }} radius={0} p={30}>
                <Title order={2} style={{ textAlign: 'center', marginTop: '1rem', marginBottom: 50 }}>
                    SMS Portal
                </Title>
            </Paper>
    );
};