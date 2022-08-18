export interface Position {
    x: number;
    y: number;
    z: number;
}
interface WorkingArea {
    pos: Position;
    end_pos: Position;
    length: number;
    width: number;
}
export interface Seeding {
    name: string;
    id: number;
    depth: number;
    min_dist: number;
    plant_type: string;
    working_area: WorkingArea;
}
export {};
