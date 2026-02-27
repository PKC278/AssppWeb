import { withBackendBase } from '../config/backend';

export interface InstallInfo {
  installUrl: string;
  manifestUrl: string;
}

export function getInstallInfo(id: string): InstallInfo {
  const manifestUrl = withBackendBase(`/api/install/${id}/manifest.plist`);
  const installUrl = `itms-services://?action=download-manifest&url=${encodeURIComponent(manifestUrl)}`;
  return { installUrl, manifestUrl };
}
