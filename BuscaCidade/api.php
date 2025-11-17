<?php

// 1. Avisa ao navegador que a resposta será JSON (e não HTML/texto)
header('Content-Type: application/json; charset=utf-8');

// Permite que qualquer site acesse (útil para testes locais)
header('Access-Control-Allow-Origin: *');

// Verifica se a cidade foi enviada
if (isset($_GET['cidade'])) {
    $cidadeBusca = mb_strtolower($_GET['cidade'], 'UTF-8');
    $url = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios";

    // Pega dados do IBGE
    $json_ibge = @file_get_contents($url);

    if ($json_ibge) {
        $dados = json_decode($json_ibge, true);
        $resultado = null;

        foreach ($dados as $municipio) {
            $nomeIBGE = mb_strtolower($municipio['nome'], 'UTF-8');
            
            // Lógica de busca
            if (strpos($nomeIBGE, $cidadeBusca) !== false) {
                $resultado = [
                    "status" => "sucesso",
                    "dados" => [
                        "cidade" => $municipio['nome'],
                        "id" => $municipio['id'],
                        "estado" => $municipio['microrregiao']['mesorregiao']['UF']['nome'],
                        "sigla" => $municipio['microrregiao']['mesorregiao']['UF']['sigla'],
                        "regiao" => $municipio['microrregiao']['mesorregiao']['UF']['regiao']['nome']
                    ]
                ];
                break; 
            }
        }

        if ($resultado) {
            echo json_encode($resultado);
        } else {
            // Retorna erro em JSON se não achar
            echo json_encode(["status" => "erro", "mensagem" => "Cidade não encontrada."]);
        }
    } else {
        echo json_encode(["status" => "erro", "mensagem" => "Erro ao conectar no IBGE."]);
    }
} else {
    echo json_encode(["status" => "erro", "mensagem" => "Nenhuma cidade informada."]);
}
?>