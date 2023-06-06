import { studentsJson } from './students/students';
import { getStudentInfo } from './students/infoStudents';
import ItemStyles from '@/styles/Item.module.scss';
import ImgCol from './imgCol';

interface StudentProps {
    id: number,
    allInfo: studentsJson,
    onClick: React.MouseEventHandler<HTMLDivElement>,
    select: boolean,
}

export default function Student({ id, allInfo, onClick, select }: StudentProps) {
    const info = getStudentInfo(allInfo, id);
    return (
        <div onClick={onClick} style={{ backgroundColor: select ? '#dce5ec' : '#f3f7f8' }} title={`id:${id}`}>
            <ImgCol
                style='student'
                size={60}
                info={info}
            />
            <div className={ItemStyles.p}>
                <p className={ItemStyles.name}>{info.schale?.Name}</p>
                <p className={ItemStyles.info}>{info.file?.info}</p>
            </div>
            <div className={ItemStyles.line} />
        </div>
    );
}

export function AllStudentsIcon() {
    return (<img src='/api/icon/line?fill=63adc6' alt='All Students Icon' />);
}