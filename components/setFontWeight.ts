import { Settings } from "./setting";

export const fontWeightNames = [
    'thin',
    'extralight',
    'light',
    'normal',
    'regular',
    'medium',
    'demibold',
    'semibold',
    'bold',
    'heavy'
];

export default function setFontWeight(fontWeight: Settings['fontWeight']) {
    const MiSansFontWeightList: Record<Required<Settings>['fontWeight'], number> = {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        regular: 400,
        medium: 500,
        demibold: 600,
        semibold: 600,
        bold: 700,
        heavy: 900,
    };
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`* {font-weight: ${MiSansFontWeightList[fontWeight || 'normal']}}`);
    document.adoptedStyleSheets = [sheet];
}