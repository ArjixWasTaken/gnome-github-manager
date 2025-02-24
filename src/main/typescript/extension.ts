import { getCurrentExtension } from '@gnome-shell/misc/extensionUtils';

import { GitHubManager } from '@github-manager/core';
import { LogLevel, Logger } from '@github-manager/utils';
import { initializeTranslations } from '@github-manager/utils/locale';

// Set global logging level
Logger.globalLoggingLevel = LogLevel.DEBUG;

/**
 * Extension entry point class.
 */
class GitHubManagerExtension {
    private static readonly LOGGER: Logger = new Logger('GitHubManagerExtension');

    private gitHubManager?: GitHubManager;

    public enable(): void {
        if (this.gitHubManager !== undefined) {
            return;
        }

        try {
            this.gitHubManager = new GitHubManager();
            this.gitHubManager.start();
        } catch (err) {
            GitHubManagerExtension.LOGGER.error('Unexpected error while enabling extension', err);
        }
    }

    public disable(): void {
        if (this.gitHubManager === undefined) {
            return;
        }

        try {
            this.gitHubManager.stop();
        } catch (err) {
            GitHubManagerExtension.LOGGER.error('Unexpected error while stopping extension', err);
        }
    }
}

export default function (): GitHubManagerExtension {
    initializeTranslations(`${getCurrentExtension().metadata.uuid}`);

    return new GitHubManagerExtension();
}
