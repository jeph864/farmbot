declare class Settings {
    private config;
    private api;
    private db;
    private api_collection;
    private current_sess_user;
    constructor(api: any, user: any);
    initial_params: {
        device_id: number;
        tray_pos: {
            x: number;
            y: number;
            z: number;
        };
        safe_height: number;
        ground_level: number;
        watering: {
            pin_number: number;
            pin_id: number;
        };
        seeding: {
            pin_number: number;
            pin_id: number;
        };
    };
    getInitialSettings: () => {
        device_id: number;
        tray_pos: {
            x: number;
            y: number;
            z: number;
        };
        safe_height: number;
        ground_level: number;
        watering: {
            pin_number: number;
            pin_id: number;
        };
        seeding: {
            pin_number: number;
            pin_id: number;
        };
    };
    getDevice: () => void;
}
export declare let config: Settings;
export {};
