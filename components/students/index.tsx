import { studentsJson } from './students';
import { getStudentInfo } from './studentsMethods';
import ImgCol from '../imgCol';
import { useLocale } from '../i18n';

export interface MessageData {
    type: 'text' | 'img' | 'time';
    id: number | 'sensei';
    msg: string;
}

interface StudentProps {
    id: number;
    allInfo: studentsJson;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    select: boolean;
    onContentMenu?: React.MouseEventHandler<HTMLDivElement>;
    infoText?: () => string;
}

export default function Student({ id, allInfo, onClick, select, onContentMenu, infoText }: StudentProps) {
    const info = getStudentInfo(allInfo, id);
    const { lo } = useLocale({});
    const bio = info.file?.bio;
    const bioText = typeof bio === 'object' && bio !== null ? bio[lo] || bio['zh-CN'] : bio;

    return (
        <div
            onClick={onClick}
            onContextMenu={e => {
                e.preventDefault();
                onContentMenu?.(e);
            }}
            className={select ? 'select' : ''}
            title={`id:${id}`}
        >
            <ImgCol
                style='student'
                size={60}
                id={id}
            />
            <div className='p'>
                <p className='name'>{info.schale?.Name}</p>
                <p className='info'>{infoText?.() || bioText}</p>
            </div>
            <div className='line' />
        </div>
    );
}

export function AllStudentsIcon() {
    return (<img src='/api/icon/line?fill=63adc6' alt='All Students Icon' />);
}