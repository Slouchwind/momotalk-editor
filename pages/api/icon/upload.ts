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
  <svg width="90px" height="90px" viewBox="0 0 90 90" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
    <g id="upload">
      <path d="M0 0L90 0L90 90L0 90L0 0Z" id="Rectangle-2" fill="#FFFFFF" fill-opacity="0" fill-rule="evenodd" stroke="none" />
      <g id="Group-2" transform="translate(12.5 11.5)">
        <path d="M12.5 22L9 22C9 22 5 22.25 3 24C1 25.75 0 30 0 30L1.19209e-07 60.5C1.19209e-07 60.5 0.125 62.875 1.5 64.5C2.875 66.125 5.5 67 5.5 67L60.5 67C60.5 67 63.5 66.125 65 64.5C66.5 62.875 66.5 60.5 66.5 60.5L66.5 28C66.5 28 66.5 25.5 65 24C63.5 22.5 60.5 22 60.5 22L54.5 22" id="Line-2" fill="none" fill-rule="evenodd" stroke="#${fill}" stroke-width="6" stroke-linecap="round" />
        <g id="Group" transform="translate(21.500004 0)">
          <path d="M12 0L12 51" id="Line-3" fill="none" fill-rule="evenodd" stroke="#${fill}" stroke-width="6" stroke-linecap="round" />
          <path d="M12 0.5L0 13" id="Line-4" fill="none" fill-rule="evenodd" stroke="#${fill}" stroke-width="6" stroke-linecap="round" />
          <path d="M12 0.5L24 12.5" id="Line-5" fill="none" fill-rule="evenodd" stroke="#${fill}" stroke-width="6" stroke-linecap="round" />
        </g>
      </g>
    </g>
  </svg>`);
}