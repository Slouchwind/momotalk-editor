import { blueArcBoxInfo, studentsJson } from './students';
import { getBioInfo, getStudentInfo } from './studentsMethods';
import ImgCol from '../imgCol';

export interface MessageData {
    type: 'text' | 'img' | 'time';
    id: number | 'sensei';
    msg: string;
}

export interface StudentProps {
    id: number;
    allInfo: studentsJson;
    blueArcBoxJson?: blueArcBoxInfo[];
    onClick: React.MouseEventHandler<HTMLDivElement>;
    select: boolean;
    onContentMenu?: React.MouseEventHandler<HTMLDivElement>;
    infoText?: () => string;
    lo: string;
}

export default function Student({ id, allInfo, blueArcBoxJson, onClick, select, onContentMenu, infoText, lo }: StudentProps) {
    const info = getStudentInfo(allInfo, id);

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
                <p className='info'>{infoText?.() || getBioInfo(blueArcBoxJson, id, lo)}</p>
            </div>
            <div className='line' />
        </div>
    );
}

export function AllStudentsIcon() {
    return (<img src='/api/icon/line?fill=63adc6' alt='All Students Icon' />);
}