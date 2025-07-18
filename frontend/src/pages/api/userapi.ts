export const fetchUserData = async (userName: string) => {
  const response = await fetch('http://backend:8000/users', {
    method: 'POST',
    body: JSON.stringify({ name: userName }),
    headers: {
      'Content-Type': 'application/json',
    },
  } );
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}