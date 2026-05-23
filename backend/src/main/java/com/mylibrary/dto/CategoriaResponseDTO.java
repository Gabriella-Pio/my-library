package com.mylibrary.dto;

public record CategoriaResponseDTO(

    Long id,
    String nome,
    String descricao,
    Long quantidadeLivros

) {
}