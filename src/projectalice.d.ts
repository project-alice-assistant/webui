export interface Device {
	deviceTypeName: string,
	perLocationLimit: number,
	totalDeviceLimit: number,
	allowLocationLinks: boolean,
	heartbeatRate: number,
	deviceSettings: Object,
	abilities: Array<any>
}

