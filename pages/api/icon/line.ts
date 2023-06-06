import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'image/svg+xml');
    let { fill = 'fff' } = req.query;
    if (fill instanceof String) fill = fill.substring(0, 6);
    res.status(200).send(`<?xml version="1.0" encoding="utf-8"?>
    <svg width="3px" height="9.5px" viewBox="0 0 3 9.5" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 0.5L1.5 9" id="Line" fill="none" fill-rule="evenodd" stroke="#${fill}" stroke-width="1" stroke-linecap="square" />
    </svg>`);
}