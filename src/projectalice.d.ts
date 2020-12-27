export interface DeviceType {
	deviceTypeName: string,
	perLocationLimit: number,
	totalDeviceLimit: number,
	allowLocationLinks: boolean,
	heartbeatRate: number,
	abilities: Array<any>,
	skillName: string
}

export interface Device {
	abilities: number,
	connected: boolean,
	deviceParams: Object,
	displayName: string,
	displaySettings: Object,
	id: number,
	lastContact: number,
	parentLocation: number,
	skillName: string,
	typeName: string,
	uid: string
}
