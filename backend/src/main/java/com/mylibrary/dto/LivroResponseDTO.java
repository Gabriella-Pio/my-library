package com.mylibrary.dto;

import com.mylibrary.entity.Status;

public record LivroResponseDTO(

    Long id,
    String titulo,
    String autor,
    String isbn,
    Integer ano,
    Status status,
    Long categoriaId,
    String categoriaNome

) {
}