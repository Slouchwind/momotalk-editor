import Image from 'next/image';
import { studentsJson } from './students/students';
import { getStudentInfo } from './students/infoStudents';
import ItemStyles from '@/styles/Item.module.scss';

interface StudentProps {
    id: number,
    allInfo: studentsJson,
    onClick: React.MouseEventHandler<HTMLDivElement>,
    select: boolean,
    onError: (id: number) => void,
}

export default function Student({ id, allInfo, onClick, select, onError }: StudentProps) {
    const info = getStudentInfo(allInfo, id);
    return (
        <div onClick={onClick} style={{ backgroundColor: select ? '#dce5ec' : '#f3f7f8' }} title={`id:${id}`}>
            <div className={ItemStyles.img}>
                <img
                    className={ItemStyles.col}
                    src={`https://schale.gg/images/student/collection/${info.schale?.CollectionTexture}.webp`}
                    alt={`${info.schale?.Name} collection image`}
                    onError={_ => onError(id)}
                />
            </div>
            <div className={ItemStyles.p}>
                <p className={ItemStyles.name}>{info.schale?.Name}</p>
                <p className={ItemStyles.info}>{info.file?.info}</p>
            </div>
            <div className={ItemStyles.line} />
        </div>
    );
}

export function AllStudentsIcon() {
    return (<Image src='/api/icon/line?fill=63adc6' alt='All Students Icon' />);
}