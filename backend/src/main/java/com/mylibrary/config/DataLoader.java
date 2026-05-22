package com.mylibrary.config;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.mylibrary.entity.Categoria;
import com.mylibrary.entity.Emprestimo;
import com.mylibrary.entity.Livro;
import com.mylibrary.entity.Status;
import com.mylibrary.repository.CategoriaRepository;
import com.mylibrary.repository.EmprestimoRepository;
import com.mylibrary.repository.LivroRepository;

@Component
public class DataLoader implements CommandLineRunner {

  private final CategoriaRepository categoriaRepository;
  private final LivroRepository livroRepository;
  private final EmprestimoRepository emprestimoRepository;

  public DataLoader(
      CategoriaRepository categoriaRepository,
      LivroRepository livroRepository,
      EmprestimoRepository emprestimoRepository) {

    this.categoriaRepository = categoriaRepository;
    this.livroRepository = livroRepository;
    this.emprestimoRepository = emprestimoRepository;
  }

  @Override
  @Transactional
  public void run(String... args) {
    if (categoriaRepository.count() > 0 || livroRepository.count() > 0 || emprestimoRepository.count() > 0) {
      return;
    }

    Categoria tecnologia = garantirCategoria(
        "Tecnologia",
        "Livros sobre programação, arquitetura e boas práticas.");
    Categoria literatura = garantirCategoria(
        "Literatura",
        "Obras clássicas e contemporâneas de ficção.");
    Categoria negocios = garantirCategoria(
        "Negócios",
        "Leituras sobre gestão, produtividade e empreendedorismo.");

    Livro cleanCode = garantirLivro(
        "Clean Code",
        "Robert C. Martin",
        "9780132350884",
        2008,
        tecnologia,
        Status.DISPONIVEL);

    Livro pragmaticProgrammer = garantirLivro(
        "The Pragmatic Programmer",
        "Andrew Hunt",
        "9780201616224",
        1999,
        tecnologia,
        Status.EMPRESTADO);

    Livro hobbit = garantirLivro(
        "O Hobbit",
        "J. R. R. Tolkien",
        "9780547928227",
        1937,
        literatura,
        Status.DISPONIVEL);

    Livro paiRicoPaiPobre = garantirLivro(
        "Pai Rico, Pai Pobre",
        "Robert T. Kiyosaki",
        "9788535203401",
        1997,
        negocios,
        Status.DISPONIVEL);

    if (emprestimoRepository.count() == 0) {
      criarEmprestimo(
          pragmaticProgrammer,
          "Marina Souza",
          "(62) 99999-9999",
          LocalDate.now().minusDays(3),
          LocalDate.now().plusDays(7),
          null);

      criarEmprestimo(
          hobbit,
          "Carlos Lima",
          "(62) 98888-7777",
          LocalDate.now().minusDays(18),
          LocalDate.now().minusDays(4),
          LocalDate.now().minusDays(2));

      pragmaticProgrammer.setStatus(Status.EMPRESTADO);
      hobbit.setStatus(Status.DISPONIVEL);

      livroRepository.save(pragmaticProgrammer);
      livroRepository.save(hobbit);
    }

    cleanCode.setStatus(Status.DISPONIVEL);
    paiRicoPaiPobre.setStatus(Status.DISPONIVEL);
    livroRepository.save(cleanCode);
    livroRepository.save(paiRicoPaiPobre);
  }

  private Categoria garantirCategoria(String nome, String descricao) {
    return categoriaRepository.findByNome(nome)
        .orElseGet(() -> categoriaRepository.save(new Categoria(nome, descricao)));
  }

  private Livro garantirLivro(
      String titulo,
      String autor,
      String isbn,
      Integer ano,
      Categoria categoria,
      Status status) {

    return livroRepository.findByIsbn(isbn)
        .orElseGet(() -> {
          Livro livro = new Livro();
          livro.setTitulo(titulo);
          livro.setAutor(autor);
          livro.setIsbn(isbn);
          livro.setAno(ano);
          livro.setCategoria(categoria);
          livro.setStatus(status);
          return livroRepository.save(livro);
        });
  }

  private void criarEmprestimo(
      Livro livro,
      String nomePessoa,
      String telefone,
      LocalDate dataEmprestimo,
      LocalDate dataDevolucaoPrevista,
      LocalDate dataDevolucaoEfetiva) {

    Emprestimo emprestimo = new Emprestimo();
    emprestimo.setLivro(livro);
    emprestimo.setNomePessoa(nomePessoa);
    emprestimo.setTelefone(telefone);
    emprestimo.setDataEmprestimo(dataEmprestimo);
    emprestimo.setDataDevolucaoPrevista(dataDevolucaoPrevista);
    emprestimo.setDataDevolucaoEfetiva(dataDevolucaoEfetiva);

    emprestimoRepository.save(emprestimo);
  }
}