interface ContentItem {
    type: string;
    color?: string;
}

interface TextCI extends ContentItem {
    type: 'text';
    text: string;
    onClick: React.MouseEventHandler;
}

interface SeparatorCI extends ContentItem {
    type: 'separator';
    height: number;
}

interface TitleCI extends ContentItem {
    type: 'title';
    text: string;
}

type Content = TextCI | SeparatorCI | TitleCI;

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
            <div className='text' style={{ color }} onClick={v.onClick} key={i}>
                <p>{v.text}</p>
            </div>
        );
        if (v.type === 'separator') return (<div className='separator' style={{ backgroundColor: color, height: v.height }} key={i} />);
        if (v.type === 'title') return (<p style={{ color }} key={i}>{v.text} </p>);
    });
    return (<>
        {set.display && (<div id='contentMenu' style={{ left: set.x, top: set.y }}>{array}</div>)}
    </>)
}