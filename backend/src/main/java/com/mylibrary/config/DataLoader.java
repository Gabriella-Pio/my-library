package com.mylibrary.config;

import com.mylibrary.entity.Categoria;
import com.mylibrary.entity.Emprestimo;
import com.mylibrary.entity.Livro;
import com.mylibrary.entity.Status;
import com.mylibrary.repository.CategoriaRepository;
import com.mylibrary.repository.EmprestimoRepository;
import com.mylibrary.repository.LivroRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final LivroRepository livroRepository;
    private final EmprestimoRepository emprestimoRepository;

    public DataLoader(CategoriaRepository categoriaRepository,
            LivroRepository livroRepository,
            EmprestimoRepository emprestimoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.livroRepository = livroRepository;
        this.emprestimoRepository = emprestimoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        Categoria tech = new Categoria();
        tech.setNome("Tecnologia");
        tech.setDescricao("Livros sobre desenvolvimento de software e arquitetura");
        categoriaRepository.save(tech);

        Categoria ficcao = new Categoria();
        ficcao.setNome("Ficção");
        ficcao.setDescricao("Romances, distopias e literatura fantástica");
        categoriaRepository.save(ficcao);

        Livro cleanCode = new Livro();
        cleanCode.setTitulo("Clean Code");
        cleanCode.setAutor("Robert C. Martin");
        cleanCode.setIsbn("978-0132350884");
        cleanCode.setAno(2008);
        cleanCode.setCategoria(tech);
        cleanCode.setStatus(Status.EMPRESTADO);
        livroRepository.save(cleanCode);

        Livro ArqLimpa = new Livro();
        ArqLimpa.setTitulo("Arquitetura Limpa");
        ArqLimpa.setAutor("Robert C. Martin");
        ArqLimpa.setIsbn("978-8550804606");
        ArqLimpa.setAno(2018);
        ArqLimpa.setCategoria(tech);
        ArqLimpa.setStatus(Status.EMPRESTADO);
        livroRepository.save(ArqLimpa);

        Livro duna = new Livro();
        duna.setTitulo("Duna");
        duna.setAutor("Frank Herbert");
        duna.setIsbn("978-8525055972");
        duna.setAno(1965);
        duna.setCategoria(ficcao);
        duna.setStatus(Status.DISPONIVEL);
        livroRepository.save(duna);

        Emprestimo emp1 = new Emprestimo();
        emp1.setLivro(cleanCode);
        emp1.setNomePessoa("José Eduardo");
        emp1.setTelefone("62999998888");
        emp1.setDataEmprestimo(LocalDate.now().minusDays(3));
        emp1.setDataDevolucaoPrevista(LocalDate.now().plusDays(4));
        emprestimoRepository.save(emp1);

        Emprestimo emp2 = new Emprestimo();
        emp2.setLivro(ArqLimpa);
        emp2.setNomePessoa("Ana Clara");
        emp2.setTelefone("62988887777");
        emp2.setDataEmprestimo(LocalDate.now().minusDays(15));
        emp2.setDataDevolucaoPrevista(LocalDate.now().minusDays(5));
        emprestimoRepository.save(emp2);
    }
}