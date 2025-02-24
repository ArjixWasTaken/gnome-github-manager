import { CURRENT_TIME } from '@gi-types/clutter10';
import { show_uri } from '@gi-types/gtk4';

import { ApiError, GitHub, GitHubClient } from '@github-manager/client';
import { EventDispatcher, Logger } from '@github-manager/utils';
import { _ } from '@github-manager/utils/locale';

import { NotificationAction } from '../NotificationAdapter';

export class OpenAction implements NotificationAction {
    private static readonly LOGGER: Logger = new Logger('notifications::actions::OpenAction');

    private readonly gitHubClient: GitHubClient;

    private readonly eventDispatcher: EventDispatcher;

    public constructor(githubClient: GitHubClient, eventDispatcher: EventDispatcher) {
        this.gitHubClient = githubClient;
        this.eventDispatcher = eventDispatcher;
    }

    public get label(): string {
        return _('Open');
    }

    public execute(notification?: GitHub.Thread): void {
        if (notification) {
            this.gitHubClient
                .getWebUrlForSubject(notification.subject)
                .then((url) => show_uri(null, url, CURRENT_TIME))
                .then(() => this.eventDispatcher.emit('notificationRead', notification.id))
                .catch((error) => {
                    if (error instanceof ApiError) {
                        OpenAction.LOGGER.error('HTTP error {0}: {1}', error.statusCode, error.message, error.cause);
                    } else {
                        OpenAction.LOGGER.error('Unexpected error while retrieving notifications', error);
                    }

                    // Fallback opening the notifications page
                    show_uri(null, `https://${this.gitHubClient.domain}/notifications`, CURRENT_TIME);
                });
        } else {
            // No specific notification selected, action on a digest notification
            show_uri(null, `https://${this.gitHubClient.domain}/notifications`, CURRENT_TIME);
        }
    }
}
