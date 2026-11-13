import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jgnlupa.app',
  appName: 'Jgn Lupa',
  webDir: 'dist',
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
    }
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_bell',
      iconColor: '#8b5cf6',
      sound: 'alarm',
    },
  },
};

export default config;
