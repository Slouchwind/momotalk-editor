interface studentsInfo {
    id?: number;
    info?: string;
}

interface schaleInfo {
    Id: number;
    IsReleased: boolean[];
    DefaultOrder: number;
    PathName: string;
    DevName: string;
    /**姓名 */
    Name: string;
    /**所在学校名字 */
    School: string;
    /**所在部门名字 */
    Club: string;
    StarGrade: number;
    SquadType: string;
    TacticRole: string;
    Summons: [];
    Position: string;
    BulletType: string;
    ArmorType: string;
    StreetBattleAdaptation: number;
    OutdoorBattleAdaptation: number;
    IndoorBattleAdaptation: number;
    WeaponType: string;
    WeaponImg: string;
    Cover: true;
    Equipment: string[];
    CollectionBG: string;
    CollectionTexture: string;
    FamilyName: string;
    FamilyNameRuby: null;
    PersonalName: string;
    SchoolYear: string;
    CharacterAge: string;
    Birthday: string;
    CharacterSSRNew: string;
    ProfileIntroduction: string
    Hobby: string;
    CharacterVoice: string;
    BirthDay: string;
    ArtistName: string;
    CharHeightMetric: string;
    CharHeightImperial: string;
    StabilityPoint: number;
    AttackPower1: number;
    AttackPower100: number;
    MaxHP1: number;
    MaxHP100: number;
    DefensePower1: number;
    DefensePower100: number;
    HealPower1: number;
    HealPower100: number;
    DodgePoint: number;
    AccuracyPoint: number;
    CriticalPoint: number;
    CriticalDamageRate: number;
    AmmoCount: number;
    AmmoCost: number;
    Range: number;
    RegenCost: number;
}

export interface Main {
    studentsJson?: studentsInfo[];
    schaleJson?: schaleInfo[];
}

export interface MainInfo {
    json?: studentsInfo;
    schale?: schaleInfo;
}

export async function getStudentJson(): Promise<Main> {
    const studentsJson: studentsInfo[] = await fetch('/students.json').then(r => r.json());
    const schaleJson: schaleInfo[] = await fetch('https://schale.gg/data/cn/students.min.json?v=102').then(r => r.json());
    return { studentsJson, schaleJson };
}

export function getStudentInfo({ studentsJson, schaleJson }: Main, studentId: number): MainInfo {
    const json = studentsJson && studentsJson.filter(info => (info.id === studentId))[0];
    const schale = schaleJson && schaleJson.filter(info => (info.Id === studentId))[0];
    return { json, schale };
}