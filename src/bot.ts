import Jarvis from './client/Jarvis';
const config: any = require('./config.json');

const jarvis: Jarvis = new Jarvis({
	name: 'Jarvis',
	token: config.token,
	config: config,
	version: '1.0.0',
	readyText: 'Ready to serve, sir.\u0007',
	passive: true
})
.start()
.on('disconnect', () => process.exit(100));
