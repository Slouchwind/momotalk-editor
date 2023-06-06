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
    <svg width="34.053787px" height="39.500008px" viewBox="0 0 34.053787 39.500008" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path d="M6.52658 6.5C6.52658 2.91015 11.2276 0 17.0266 0C22.8256 0 27.5266 2.91015 27.5266 6.5C27.5266 10.0899 22.8256 13 17.0266 13C11.2276 13 6.52658 10.0899 6.52658 6.5Z" id="path_1" />
        <clipPath id="clip_1">
          <use xlink:href="#path_1" />
        </clipPath>
      </defs>
      <g id="info">
        <path d="M0.0265776 39.5L34.0265 39.5C34.0265 39.5 35.0516 27.19 24.5266 25.5C24.5016 25.45 9.55158 25.55 9.52658 25.5C-0.988403 27.09 0.0265776 39.5 0.0265776 39.5Z" id="Line" fill="#${fill}" fill-rule="evenodd" stroke="none" />
        <g id="Oval-2">
          <g clip-path="url(#clip_1)">
            <use xlink:href="#path_1" fill="none" stroke="#ff899e" stroke-width="4" />
          </g>
        </g>
        <path d="M5.52658 16.5C5.52658 10.1487 10.6753 5 17.0266 5C23.3779 5 28.5266 10.1487 28.5266 16.5C28.5266 22.8513 23.3779 28 17.0266 28C10.6753 28 5.52658 22.8513 5.52658 16.5Z" id="Oval" fill="#${fill}" fill-rule="evenodd" stroke="none" />
      </g>
    </svg>`);
}