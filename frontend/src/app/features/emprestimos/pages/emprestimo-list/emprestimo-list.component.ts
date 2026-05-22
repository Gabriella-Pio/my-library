import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { EmprestimoService } from '../../services/emprestimo.service';
import { Emprestimo } from '../../models/emprestimo.model';

@Component({
  selector: 'app-emprestimo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './emprestimo-list.component.html',
  styleUrls: ['./emprestimo-list.component.css'],
})
export class EmprestimoListComponent implements OnInit {
  emprestimos: Emprestimo[] = [];
  emprestimosFiltrados: Emprestimo[] = [];

  termoBusca = '';

  loading = true;

  constructor(private emprestimoService: EmprestimoService) {}

  ngOnInit(): void {
    this.carregarEmprestimos();
  }

  carregarEmprestimos(): void {
    this.loading = true;

    this.emprestimoService.listar().subscribe({
      next: (emprestimos) => {
        this.emprestimos = emprestimos;
        this.emprestimosFiltrados = emprestimos;
        this.loading = false;
      },

      error: (erro) => {
        console.error('Erro ao carregar empréstimos', erro);
        this.loading = false;
      },
    });
  }

  filtrarEmprestimos(): void {
    const termo = this.termoBusca.toLowerCase().trim();

    if (!termo) {
      this.emprestimosFiltrados = this.emprestimos;
      return;
    }

    this.emprestimosFiltrados = this.emprestimos.filter(
      (emprestimo) =>
        emprestimo.nomePessoa.toLowerCase().includes(termo) ||
        emprestimo.livroTitulo.toLowerCase().includes(termo),
    );
  }

  limparBusca(): void {
    this.termoBusca = '';
    this.emprestimosFiltrados = this.emprestimos;
  }

  devolverLivro(id: number): void {
    const confirmar = confirm('Deseja realmente devolver este livro?');

    if (!confirmar) {
      return;
    }

    this.emprestimoService.devolver(id).subscribe({
      next: () => {
        this.carregarEmprestimos();
      },

      error: (erro) => {
        console.error('Erro ao devolver livro', erro);
      },
    });
  }
}
