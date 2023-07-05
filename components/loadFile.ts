import JSZip from 'jszip';

export function uploadFile(onload: (blob: Promise<JSZip>, name: string) => void) {
    const anchor = document.createElement('input');
    anchor.type = 'file';
    anchor.accept = '.mte';
    document.body.appendChild(anchor);
    anchor.addEventListener('change', () => {
        const file = anchor.files?.[0];
        if (!file) return;
        onload(JSZip.loadAsync(file), file.name);
    });
    anchor.click();
}

export async function downloadFile(json: object, filename: string) {
    const zip = new JSZip();
    const blob = await zip.file('messageData.json', JSON.stringify(json)).generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

export function downloadSVG(blob: string, filename: string) {
    const url = URL.createObjectURL(new Blob([blob]));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename + '.svg';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}