export function downloadFile(json: object, filename: string) {
    const data = JSON.stringify(json, null, 4);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    //Remove the Element and the Url
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

export function uploadFile(fileOnLoad: FileReader['onload']) {
    const anchor = document.createElement('input');
    anchor.type = 'file';
    anchor.accept = 'application/json';
    document.body.appendChild(anchor);
    anchor.addEventListener('change', () => {
        if (!anchor.files?.[0]) return;
        const reader = new FileReader();
        reader.readAsText(anchor.files?.[0]);
        reader.onload = fileOnLoad;
    });
    anchor.click();
}