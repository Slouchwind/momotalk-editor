interface ContentItem {
    type: string;
    color?: string;
}

interface TextContentItem extends ContentItem {
    type: 'text';
    text: string;
    onClick: React.MouseEventHandler;
}

interface SeparatorContentItem extends ContentItem {
    type: 'separator';
    height: number;
}

type Content = TextContentItem | SeparatorContentItem;

export interface ContentMenuSet {
    x: number;
    y: number;
    content: Content[];
    display: boolean;
}

export default function ContentMenu({ set }: { set: ContentMenuSet }) {
    let array = set.content.map((v, i) => {
        const { color = '#000' } = v;
        if (v.type === 'text') return (
            <div style={{ color }} onClick={v.onClick} key={i}>
                <p>{v.text}</p>
            </div>
        );
        if (v.type === 'separator') return <hr style={{ color, height: v.height }} key={i} />;
    });
    return (<>
        {set.display && (<div id='contentMenu' style={{ left: set.x, top: set.y }}>{array}</div>)}
    </>)
}