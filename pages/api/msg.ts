import type { NextApiRequest, NextApiResponse } from 'next';
import MinusCode from 'minus-code';

const mccode = new MinusCode();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'image/svg+xml');
    let { w, h } = req.query;
    let { data } = req.body;
    const svg = `
<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
<style>
div.imgCol {overflow: hidden;border-radius: 50%;display: grid;justify-content: center;align-content: center;user-select: none;}
div.imgCol img.col {width: 100%;}div.message {display: flex;flex-direction: row;width: 100%;text-align: start;}
div.message > div#right {margin: 10px 0;display: flex;flex-direction: column;flex-wrap: nowrap;width: calc(100% - 105px);}
div.message > div#right > p {margin: 0;margin-bottom: 2px;}
div.message > div#right > div > div#triangle {background-color: #4c5a6e;width: 7.5px;height: 7.5px;position: relative;transform: scale(1.5, 1) rotate(45deg);top: 16px;right: 0.5px;}
div.message > div#right > div > div#text {padding: 2.5px 10px;color: #fff;background-color: #4c5a6e;border-radius: 7.5px;width: fit-content;}
div.message > div#right > div > div#text > p {margin: 0;word-wrap: break-word;word-break: break-all;}
div.message > div#right > div > div#img > img {width: auto;height: 200px;}
div.sensei {float: right;width: calc(100% - 45px);text-align: start;}
div.sensei > div#triangle {background-color: #4a89ca;width: 7.5px;height: 7.5px;position: relative;transform: scale(1.5, 1) rotate(45deg);top: 21px;left: calc(100% - 21px);}
div.sensei > div#text {padding: 2.5px 10px;color: #fff;background-color: #4a89ca;border-radius: 7.5px;width: fit-content;float: right;margin: 5px 15px 5px 0;}
div.sensei > div#text > p {margin: 0;word-wrap: break-word;word-break: break-all;}
div.sensei > div#img > img {width: auto;height: 200px;float: right;margin: 5px 15px 5px 0;}
</style>

<foreignObject x="0" y="0" width="${w}" height="${h}">
<div xmlns="http://www.w3.org/1999/xhtml">
${mccode.decode(data)}
</div>
</foreignObject>
</svg>
`;
    res.status(200).send(svg);
}