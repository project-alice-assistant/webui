export interface DeviceType {
	deviceTypeName: string,
	perLocationLimit: number,
	totalDeviceLimit: number,
	allowLocationLinks: boolean,
	heartbeatRate: number,
	abilities: Array<any>,
	skillName: string,
	deviceConfigsTemplates: object,
	linkConfigsTemplates: object,
	allowHeartbeatOverride: boolean
}

export interface Device {
	abilities: number,
	connected: boolean,
	deviceParams: Object,
	deviceConfigs: Object,
	displayName: string,
	settings: Object,
	id: number,
	lastContact: number,
	parentLocation: number,
	skillName: string,
	typeName: string,
	uid: string
}

export interface Link {
	configs: Object,
	deviceId: number,
	deviceUid: string,
	id: number,
	targetLocation: number
}
