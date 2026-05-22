package com.mylibrary.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "emprestimos")
public class Emprestimo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "livro_id", nullable = false)
  private Livro livro;

  @NotBlank
  @Column(nullable = false)
  private String nomePessoa;

  @NotBlank
  @Column(nullable = false, length = 20)
  private String telefone;

  @NotNull
  @Column(nullable = false)
  private LocalDate dataEmprestimo;

  @NotNull
  @Column(nullable = false)
  private LocalDate dataDevolucaoPrevista;

  private LocalDate dataDevolucaoEfetiva;

  public Emprestimo() {
  }

  public Emprestimo(Long id, Livro livro, String nomePessoa, String telefone, LocalDate dataEmprestimo,
      LocalDate dataDevolucaoPrevista, LocalDate dataDevolucaoEfetiva) {
    this.id = id;
    this.livro = livro;
    this.nomePessoa = nomePessoa;
    this.telefone = telefone;
    this.dataEmprestimo = dataEmprestimo;
    this.dataDevolucaoPrevista = dataDevolucaoPrevista;
    this.dataDevolucaoEfetiva = dataDevolucaoEfetiva;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Livro getLivro() {
    return livro;
  }

  public void setLivro(Livro livro) {
    this.livro = livro;
  }

  public String getNomePessoa() {
    return nomePessoa;
  }

  public void setNomePessoa(String nomePessoa) {
    this.nomePessoa = nomePessoa;
  }

  public String getTelefone() {
    return telefone;
  }

  public void setTelefone(String telefone) {
    this.telefone = telefone;
  }

  public LocalDate getDataEmprestimo() {
    return dataEmprestimo;
  }

  public void setDataEmprestimo(LocalDate dataEmprestimo) {
    this.dataEmprestimo = dataEmprestimo;
  }

  public LocalDate getDataDevolucaoPrevista() {
    return dataDevolucaoPrevista;
  }

  public void setDataDevolucaoPrevista(LocalDate dataDevolucaoPrevista) {
    this.dataDevolucaoPrevista = dataDevolucaoPrevista;
  }

  public LocalDate getDataDevolucaoEfetiva() {
    return dataDevolucaoEfetiva;
  }

  public void setDataDevolucaoEfetiva(LocalDate dataDevolucaoEfetiva) {
    this.dataDevolucaoEfetiva = dataDevolucaoEfetiva;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    Emprestimo that = (Emprestimo) o;
    return id != null && id.equals(that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

  @Override
  public String toString() {
    return "Emprestimo{" +
        "id=" + id +
        ", livro=" + (livro != null ? livro.getId() : null) +
        ", nomePessoa='" + nomePessoa + '\'' +
        ", telefone='" + telefone + '\'' +
        ", dataEmprestimo=" + dataEmprestimo +
        ", dataDevolucaoPrevista=" + dataDevolucaoPrevista +
        ", dataDevolucaoEfetiva=" + dataDevolucaoEfetiva +
        '}';
  }
}
