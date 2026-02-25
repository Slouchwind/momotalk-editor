export default function getTitle(title?: string): string {
    return 'MomoTalk' + (title ? ` | ${title}` : '');
}