import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result = {};

  if (req.method === 'GET') {
    const { uri, graph } = req.query;

    if (!uri || !graph) {
      result = { error: 'Missing required query parameters: uri and graph' };
      res.status(400).json(result);
      return result;
    }

    // console.log(graph)
    const url = `${process.env.IP_FAIR_LEVEL_INDICATOR}/?uri=${uri}&graph=${graph}`;

    try {
      const response = await fetch(url);
      // console.log(url)

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // console.log(data);

      res.status(200).json(data);
      // result = data ? JSON.parse(data) : null;
      result = data
      // result = JSON.stringify(data);
    } catch (error) {
      result = { error: 'Error fetching data' };
      res.status(500).json(result);
    }
  } else {
    result = { error: 'Method not allowed' };
    res.status(405).json(result);
  }

  return result;
}