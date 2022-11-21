<?php

namespace OCA\DiscretePdfSigner\AppInfo;

use OCP\AppFramework\App;
use OCP\EventDispatcher\IEventDispatcher;
use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCP\IServerContainer;
use OCA\DiscretePdfSigner\Listener\LoadAdditionalScriptsListener;
use OCA\DiscretePdfSigner\Middleware\CustomCorsMiddleware;

use OCA\DiscretePdfSigner\Connector\Sabre\CorsPlugin;
use OCP\AppFramework\QueryException;
use OCP\IConfig;
use OCP\IContainer;
use OCP\SabrePluginEvent;
// use OCA\DiscretePdfSigner\Utility\PsrLogger;
// use OCA\DiscretePdfSigner\Config\Config;


class Application extends App {

    public const APP_ID = 'discretepdfsigner';

    public function __construct(array $params = []) {
        parent::__construct(self::APP_ID, $params);
        // $container = $this->getContainer();

        // $container->registerService('CustomCorsMiddleware', function($c){
        //     return new CustomCorsMiddleware();
        // });
        // $container->registerMiddleware(CustomCorsMiddleware::class);

        // $dispatcher = $container->getServer()->query(IEventDispatcher::class);
        // $dispatcher->addServiceListener(LoadAdditionalScriptsEvent::class, LoadAdditionalScriptsListener::class);


        $container = $this->getContainer();
        $server = $container->getServer();

        // Register logger service
        // $container->registerService(PsrLogger::class, function (IContainer $c): PsrLogger {
        //     return new PsrLogger(
        //         $c->query('ServerContainer')->getLogger(),
        //         $c->query('AppName')
        //     );
        // });

        // // Register logger parameters
        // $container->registerService('LoggerParameters', function (IContainer $c): array {
        //     return ['app' => $c->query('AppName')];
        // });

        // // Register config service
        // $container->registerService(Config::class, function (IContainer $c): Config {
        //     return new Config(
        //         $c->query(IConfig::class),
        //         $c->query(PsrLogger::class),
        //         $c->query('LoggerParameters')
        //     );
        // });

        /** @var IEventDispatcher $eventDispatcher */
        $eventDispatcher = $server->query(IEventDispatcher::class);

        // Inject CORS headers to allow WebDAV access from inside a webpage
        // $eventDispatcher->addListener(
        //     'OCA\DAV\Connector\Sabre::addPlugin',
        //     function(SabrePluginEvent $event) use ($container) {
        //         $event->getServer()->addPlugin(new CorsPlugin());
        //     }
        // );

        // $dispatcher = $container->getServer()->query(IEventDispatcher::class);
        $eventDispatcher->addServiceListener(LoadAdditionalScriptsEvent::class, LoadAdditionalScriptsListener::class);
    }

}
