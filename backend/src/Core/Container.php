<?php
namespace App\Core;

class Container
{
    private static array $instances = [];

    public static function resolve(string $class)
    {
        // Se già instanziato, ritorna quello (sigleton)
        if (isset(self::$instances[$class])) {
            return self::$instances[$class];
        }

        // Usa Reflection per leggere il costruttore
        $reflection = new \ReflectionClass($class);
        $constructor = $reflection->getConstructor();

        // Se non ha costruttore, instanzia direttamente
        if (!$constructor) {
            return self::$instances[$class] = new $class();
        }

        // Risolvi ricorsivamente tutte le dipendenze
        $params = [];
        foreach ($constructor->getParameters() as $param) {
            $type = $param->getType();
            if ($type instanceof \ReflectionNamedType && !$type->isBuiltin()) {
                // Chiama resolve ricorsivamente per ogni dipendenza
                $params[] = self::resolve($type->getName());
            }
        }

        // Instanza con tutte le dipendenze risolte
        return self::$instances[$class] = $reflection->newInstanceArgs($params);
    }
}