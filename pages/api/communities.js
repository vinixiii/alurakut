import { SiteClient } from 'datocms-client';

export default async function getRequests(req, res) {
  if (req.method === 'POST') {
    const TOKEN = process.env.API_KEY;
    const client = new SiteClient(TOKEN);

    const record = await client.items.create({
      itemType: '966633', //Id do Model 'Community' criado lá no DatoCMS
      ...req.body,
    });

    res.json({
      recordCreated: record,
    });
  }
}
