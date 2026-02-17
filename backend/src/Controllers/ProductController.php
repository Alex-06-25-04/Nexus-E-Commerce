<?php
namespace App\Controllers;

use App\Services\ProductService;
use App\Core\Session;
use App\Core\Request;
use App\Core\Response;
use App\Config\Logger;

class ProductController
{
    private ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index()
    {
        $user = Session::get('user');

        $userId = $user['id'] ?? null;
        $guestId = Session::getOrCreateGuestId();

        try {
            $name = Request::params('name');
            $category = Request::params('category');

            $filters = array_filter(
                [
                    'name' => $name,
                    'category' => $category
                ],
                fn($value) => !is_null($value) && $value !== ''
            );

            $products = $this->productService->getAll($userId, $guestId, $filters);

            Response::json([
                'success' => true,
                'data' => $products
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Get Products Failed', [
                'error' => $e->getMessage()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    public function show(int $id)
    {
        $user = Session::get('user');

        $userId = $user['id'] ?? null;
        $guestId = Session::getOrCreateGuestId();

        try {
            $product = $this->productService->getProductById($userId, $guestId, $id);

            Response::json([
                'success' => true,
                'product' => $product
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Get Product failed', [
                'error' => $e->getMessage()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    public function store()
    {
        try {
            $tables = $this->productService->getColumns();
            $allowedFields = array_keys($tables);

            $datas = Request::all($allowedFields);
            if (Request::file('image')) {
                $datas['image'] = Request::file('image');
            }

            if (Request::file('bg_image')) {
                $datas['bg_image'] = Request::file('bg_image');
            }
            
            $product = $this->productService->createProduct($datas);

            Response::json([
                'success' => true,
                'data' => $product
            ], 201);

        } catch (\Exception $e) {
            Logger::error('Create Product failed', [
                'error' => $e->getMessage()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    public function update(int $id)
    {
        try {
            $products = $this->productService->onlyDataRequested($id);
            $allowedFields = array_keys($products);

            $datas = Request::all($allowedFields);
            $datas['image'] = Request::file('image');
            $datas['bg_image'] = Request::file('bg_image');

            $updateProduct = $this->productService->updateProduct($id, $datas);

            Response::json([
                'success' => true,
                'data' => $updateProduct
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Update Product failed', [
                'error' => $e->getMessage()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->productService->deleteProduct($id);

            Response::json([
                'success' => true,
                'message' => 'Prodotto eliminato'
            ], 200);

        } catch (\Exception $e) {
            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }
}