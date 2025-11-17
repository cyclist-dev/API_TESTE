<?php
// api.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$acao = isset($_GET['acao']) ? $_GET['acao'] : '';


if ($acao == 'buscar') {
    $nome = urlencode($_GET['nome']);
    // Buscamos até 5 cidades parecidas
    $url = "https://geocoding-api.open-meteo.com/v1/search?name={$nome}&count=5&language=pt&format=json";
    
    $response = @file_get_contents($url);
    
    if ($response) {
        $dados = json_decode($response, true);
        
        if (isset($dados['results'])) {
            $lista = [];
            foreach ($dados['results'] as $item) {
                $lista[] = [
                    "nome" => $item['name'],
                    "estado" => $item['admin1'] ?? '',
                    "pais" => $item['country'],
                    "lat" => $item['latitude'],
                    "lon" => $item['longitude']
                ];
            }
            echo json_encode(["status" => "sucesso", "dados" => $lista]);
        } else {
            echo json_encode(["status" => "erro", "mensagem" => "Nada encontrado"]);
        }
    } else {
        echo json_encode(["status" => "erro", "mensagem" => "Erro na API externa"]);
    }
}


elseif ($acao == 'clima') {
    $lat = $_GET['lat'];
    $lon = $_GET['lon'];

    
    $url = "https://api.open-meteo.com/v1/forecast?latitude={$lat}&longitude={$lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m";

    $response = @file_get_contents($url);

    if ($response) {
        $dados = json_decode($response, true);
        $atual = $dados['current'];

        echo json_encode([
            "status" => "sucesso",
            "dados" => [
                "temp" => $atual['temperature_2m'],
                "umidade" => $atual['relative_humidity_2m'],
                "vento" => $atual['wind_speed_10m'],
                "codigo" => $atual['weather_code'] // O código numérico é universal!
            ]
        ]);
    } else {
        echo json_encode(["status" => "erro", "mensagem" => "Erro ao pegar clima"]);
    }
}
?>