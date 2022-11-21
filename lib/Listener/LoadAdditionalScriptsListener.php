<?php

namespace OCA\DiscretePdfSigner\Listener;

use OCP\EventDispatcher\IEventListener;
use OCP\EventDispatcher\Event;
use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCA\DiscretePdfSigner\AppInfo\Application;
use OCP\Util;



class LoadAdditionalScriptsListener implements IEventListener {

    public function handle(Event $event): void {
        if (!($event instanceOf LoadAdditionalScriptsEvent)) {
            return;
        }


        // TODO: update file menu item.
        Util::addScript(Application::APP_ID, 'file_action_sign_pdf');
    }

}