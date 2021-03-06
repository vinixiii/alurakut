import { SiteClient } from 'datocms-client';

export default async function getRequests(req, res) {
  if (req.method === 'POST') {
    const client = new SiteClient(process.env.API_KEY);

    const record = await client.items.create({
      itemType: '972394', //Id do Model 'Scrap' criado lá no DatoCMS
      ...req.body,
    });

    res.json({
      recordCreated: record,
    });
  }
}
