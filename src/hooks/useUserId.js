export async function useUserId(username) {
  const { data } = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'a4f7abf1a97be84d00efed71df0b1c',
    },
    body: JSON.stringify({
      query: `query {
        user(filter: {username: {eq: "${username}"}}) {
          id
        }
      }`,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  if (data.user !== null) {
    return data.user.id;
  }

  return null;
}
