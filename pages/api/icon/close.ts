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
  <svg width="7px" height="7px" viewBox="0 0 7 7" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
    <g id="Group">
      <path d="M0 0L7 0L7 7L0 7L0 0Z" id="Rectangle-2" fill="#${fill}" fill-opacity="0" fill-rule="evenodd" stroke="none" />
      <path d="M1.00012 1L6.00022 6.00009" id="Line-2" fill="none" fill-rule="evenodd" stroke="#${fill}" stroke-width="1" stroke-linecap="round" />
      <path d="M1.00009 6.00009L6.00019 1" id="Line-2-Copy" fill="none" fill-rule="evenodd" stroke="#${fill}" stroke-width="1" stroke-linecap="round" />
    </g>
  </svg>`);
}