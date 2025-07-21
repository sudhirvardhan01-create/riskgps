
import TicketCard from '@/components/library/risk scenario/riskscenariocard'
import { Stack } from '@mui/material';
import React from 'react'

const Index = () => {

  const riskData = [
  {
    id: 'RS-8306439',
    industry: 'Healthcare',
    title: 'The Fund/Wire Transfer System is not working for extended period of time',
    tags: 4,
    processes: 3,
    assets: 15,
    threats: 10,
    lastUpdated: '08 Jan, 2024',
    status: 'Enabled',
  },
  {
    id: 'RS-8306439',
    industry: 'Healthcare',
    title: 'The Fund/Wire Transfer System is not working for extended period of time',
    tags: 4,
    processes: 3,
    assets: 15,
    threats: 10,
    lastUpdated: '08 Jan, 2024',
    status: 'Draft',
  },
  {
    id: 'RS-8306439',
    industry: 'Healthcare',
    title: 'Patients cannot avail diagnostic facility because the devices are not operational for an extended period of time',
    tags: 4,
    processes: 3,
    assets: 15,
    threats: 10,
    lastUpdated: '08 Jan, 2024',
    status: 'Disabled',
  },
  // Add more cards as needed
];

  return (
    <>
    <div>Risk Scenario in prod</div>
    <Stack spacing={2}>
        {riskData.map((item, index) => (
          <TicketCard key={index} {...item} />
        ))}
      </Stack>
    </>
  )
}

export default Index