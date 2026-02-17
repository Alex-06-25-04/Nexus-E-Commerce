<?php
namespace App\Services;

use App\Repositories\CategoryRepository;
use App\Config\Logger;

class CategoryService
{
    private CategoryRepository $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function get()
    {
        $cats = $this->categoryRepository->getAll();
        if (empty($cats)) {
            Logger::info('No categories found', [
                'message' => 'Category list is empty'
            ]);

            return;
        }

        return $cats;
    }

    public function getCatById(int $catId)
    {
        $cat = $this->categoryRepository->getById($catId);
        if (!$cat) {
            Logger::error('No category found', [
                'message' => 'Category not found'
            ]);

            throw new \Exception('Category Not Found');
        }

        return [
            'product_datas' => [
                'id' => $cat['id'],
                'name' => $cat['name'],
                'slug' => $cat['slug']
            ]
        ];
    }
}