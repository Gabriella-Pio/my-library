package com.mylibrary.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "livros")
public class Livro {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 255)
  @Column(nullable = false)
  private String titulo;

  @NotBlank
  @Size(max = 255)
  @Column(nullable = false)
  private String autor;

  @NotBlank
  @Pattern(regexp = "^[0-9\\-]{10,20}$")
  @Column(unique = true, nullable = false, length = 20)
  private String isbn;

  @NotNull
  @Column(nullable = false)
  private Integer ano;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "categoria_id", nullable = false)
  private Categoria categoria;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Status status = Status.DISPONIVEL;

  public Livro(Long id, String titulo, String autor, String isbn, Integer ano, Categoria categoria) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
    this.ano = ano;
    this.categoria = categoria;
  }

  public Livro() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitulo() {
    return titulo;
  }

  public void setTitulo(String titulo) {
    this.titulo = titulo;
  }

  public String getAutor() {
    return autor;
  }

  public void setAutor(String autor) {
    this.autor = autor;
  }

  public String getIsbn() {
    return isbn;
  }

  public void setIsbn(String isbn) {
    this.isbn = isbn;
  }

  public Integer getAno() {
    return ano;
  }

  public void setAno(Integer ano) {
    this.ano = ano;
  }

  public Categoria getCategoria() {
    return categoria;
  }

  public void setCategoria(Categoria categoria) {
    this.categoria = categoria;
  }

  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (!(o instanceof Livro))
      return false;
    Livro that = (Livro) o;
    return id != null && id.equals(that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return "Livro{" +
        "id=" + id +
        ", titulo='" + titulo + '\'' +
        ", autor='" + autor + '\'' +
        ", isbn='" + isbn + '\'' +
        ", ano=" + ano +
        ", categoria=" + (categoria != null ? categoria.getId() : null) +
        ", status=" + status +
        '}';
  }
}