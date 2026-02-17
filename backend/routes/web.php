<?php
use Bramus\Router\Router;
use App\Core\Session;
use App\Core\Response;
use App\Core\Container;

$router = new Router();

// Middleware Admin
$router->before('POST|PUT|PATCH|DELETE', 'api/products(/.*)?', function () {
    $user = Session::get('user');

    if (!Session::isLogged() || !isset($user['role']) || $user['role'] !== 'admin') {
        Response::json([
            'success' => false,
            'message' => 'Forbidden - Admin access required'
        ], 403);
        exit;
    }
});


// ==========================================
// ROUTES API REST
// ==========================================

// Prefix API
$router->mount('/api', function () use ($router) {
    $router->mount('/auth', function () use ($router) {
        $router->post('/register', function () {
            $controller = Container::resolve('App\Controllers\AuthController');
            return $controller->register();
        });
        $router->post('/login', function () {
            $controller = Container::resolve('App\Controllers\AuthController');
            return $controller->login();
        });
        $router->get('/check', function () {
            $controller = Container::resolve('App\Controllers\AuthController');
            return $controller->checkStatus();
        });
        $router->post('/logout', function () {
            $controller = Container::resolve('App\Controllers\AuthController');
            return $controller->logout();
        });
    });

    $router->mount('/products', function () use ($router) {
        $router->get('/all', function () {
            $controller = Container::resolve('App\Controllers\ProductController');
            return $controller->index();
        });
        $router->get('/(\d+)', function ($id) {
            $controller = Container::resolve('App\Controllers\ProductController');
            return $controller->show($id);
        });
        $router->post('/', function () {
            $controller = Container::resolve('App\Controllers\ProductController');
            return $controller->store();
        });
        $router->put('/(\d+)', function ($id) {
            $controller = Container::resolve('App\Controllers\ProductController');
            return $controller->update($id);
        });
        $router->delete('/(\d+)', function ($id) {
            $controller = Container::resolve('App\Controllers\ProductController');
            return $controller->destroy($id);
        });
    });

    $router->mount('/favorites', function () use ($router) {
        $router->get('/all', function () {
            $controller = Container::resolve('App\Controllers\FavoriteController');
            return $controller->index();
        });
        $router->post('/toggle', function () {
            $controller = Container::resolve('App\Controllers\FavoriteController');
            return $controller->toggle();
        });
        $router->delete('/(\d+)', function ($id) {
            $controller = Container::resolve('App\Controllers\FavoriteController');
            return $controller->delete($id);
        });
    });

    $router->mount('/categories', function () use ($router) {
        $router->get('/all', function () {
            $controller = Container::resolve('App\Controllers\CategoryController');
            return $controller->getAll();
        });
        $router->get('/(\d+)', function ($id) {
            $controller = Container::resolve('App\Controllers\CategoryController');
            return $controller->getById($id);
        });
    });

    $router->mount('/cart', function () use ($router) {
        $router->get('/', function () {
            $controller = Container::resolve('App\Controllers\CartController');
            return $controller->getCartItems();
        });
        $router->post('/(\d+)', function ($id) {
            $controller = Container::resolve('App\Controllers\CartController');
            return $controller->insertCartItem($id);
        });
        $router->patch('/(\d+)', function ($id) {
            $controller = Container::resolve('App\Controllers\CartController');
            return $controller->updateQty($id);
        });
        $router->post('/checkout', function () {
            $controller = Container::resolve('App\Controllers\CartController');
            return $controller->checkout();
        });
        $router->delete('/(\d+)', function ($id) {
            $controller = Container::resolve('App\Controllers\CartController');
            return $controller->deleteCartItem($id);
        });
    });
});

$router->run();