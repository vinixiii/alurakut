export async function useCommunities(userId) {
  const { data } = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'a4f7abf1a97be84d00efed71df0b1c',
    },
    body: JSON.stringify({
      query: `query {
        allCommunities(filter: { users: { allIn: ["${userId}"] } }) {
          id,
          title,
          imageUrl,
          creatorSlug
        }
      }`,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.erro(err));

  return data.allCommunities;
}
