<?php
namespace App\Controllers;

use App\Services\CategoryService;
use App\Core\Response;
use App\Config\Logger;

class CategoryController
{
    private CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function getAll()
    {
        try {
            $categories = $this->categoryService->get();

            return Response::json([
                'success' => true,
                'categories' => $categories
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Get Categories Failed', [
                'error' => $e->getMessage()
            ]);

            return Response::json([
                'success' => false,
                'error' => 'Internal Server Error'
            ], 500);
        }
    }

    public function getById($id)
    {
        try {
            $category = $this->categoryService->getCatById($id);

            return Response::json([
                'success' => true,
                'product' => $category
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Get Category failed', [
                'error' => $e->getMessage()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }
}