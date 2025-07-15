import React, { use } from 'react'
import { fetchUserData } from '../api/userapi';
import { Button, FormControl, InputLabel, TextField } from '@mui/material';

const UserPage = () => {
  const [userName, setUserName] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchUserData(userName)
      .then(data => {
        alert(`User data for ${userName}: ${JSON.stringify(data)}`);
        console.log('User data fetched successfully:', data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    // Handle form submission logic here
  };
  return (
    <FormControl sx={{display: "flex", alignItems: "center", justifyContent: "center", height:"90vh"}} component="form" onSubmit={handleSubmit}>
      <TextField label="User Name" sx={{backgroundColor: "#f5f5f5", mb: 4}} type='text' onChange={(e) => {
        setUserName(e.target.value);
      }}/>
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </FormControl>
  )
}

export default UserPage
