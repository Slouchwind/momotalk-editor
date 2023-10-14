import { studentInfo } from "./students/students";

type keyofDefaultStyle = 'content' | 'student';
const DefaultStyle: { [K in keyofDefaultStyle]: React.CSSProperties } = {
    content: {
        margin: 'auto',
        marginTop: 20,
        marginBottom: 5,
    },
    student: {
        margin: 10,
    },
}

interface ImgColProps {
    style: React.CSSProperties | keyofDefaultStyle;
    size: number;
    id: number;
}

export default function ImgCol({ style, size, id }: ImgColProps) {
    if (typeof style === 'string') style = DefaultStyle[style];
    const imgStyle: React.CSSProperties = {
        width: size,
        height: size,
        ...style,
    }
    return (<div className='imgCol' style={imgStyle}>
        <img
            className='col'
            src={`https://schale.gg/images/student/collection/${id}.webp`}
            alt={`${id || ''} collection image`}
        />
    </div>);
}