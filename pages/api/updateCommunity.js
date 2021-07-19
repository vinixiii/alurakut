import { SiteClient } from 'datocms-client';
import nookies from 'nookies';

export default async function getRequests(req, res) {
  if (req.method === 'POST') {
    const TOKEN = process.env.API_KEY;
    const client = new SiteClient(TOKEN);
    const userId = req.body.userId;
    const communityId = req.body.communityId;
    const itemId = communityId;

    const members = await client.items.all({
      filter: {
        type: 'community',
        fields: {
          id: { eq: itemId },
        },
      },
    });

    const record = await client.items.update(itemId, {
      users: [...members[0].users, userId],
    });

    res.json({
      recordCreated: record,
    });
  }
}

export async function getServerSideProps(context) {
  const userToken = await nookies.get(context).token;

  return {
    props: {
      token: userToken,
    },
  };
}
