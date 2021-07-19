export async function useCheckAuth(userToken) {
  const { isAuthenticated } = await fetch(
    'https://alurakut-vinixiii.vercel.app/api/auth',
    {
      headers: {
        Authorization: userToken,
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));

  return isAuthenticated;
}
