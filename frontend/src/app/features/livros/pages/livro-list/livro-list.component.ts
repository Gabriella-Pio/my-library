import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subject, debounceTime, switchMap } from 'rxjs';

import { Livro } from '../../models/livro.model';
import { Categoria } from '../../../categorias/models/categoria.model';
import { Status } from '../../models/status.enum';
import { LivroService } from '../../services/livro.service';
import { CategoriaService } from '../../../categorias/services/categoria.service';

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './livro-list.component.html',
  styleUrl: './livro-list.component.css',
})
export class LivroListComponent implements OnInit {
  livros: Livro[] = [];
  categorias: Categoria[] = [];

  // Termo de busca
  termoBusca = '';
  // Filtro por categoria
  categoriaFiltro: number | null = null;
  // Filtro por status
  statusFiltro: Status | null = null;

  loading = true;
  carregandoCategorias = true;
  erroMensagem = '';

  Status = Status;

  private filtroSubject = new Subject<void>();

  constructor(
    private livroService: LivroService,
    private categoriaService: CategoriaService,
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
    this.configurarAutoFiltro();
    this.filtroSubject.next();
  }

  private configurarAutoFiltro(): void {
    this.filtroSubject
      .pipe(
        debounceTime(400),
        switchMap(() => {
          this.loading = true;
          this.erroMensagem = '';

          return this.livroService.listarComFiltros(
            this.categoriaFiltro ?? undefined,
            this.statusFiltro ?? undefined,
            this.termoBusca || undefined,
          );
        }),
      )
      .subscribe({
        next: (dados: Livro[]) => {
          this.livros = dados;
          this.loading = false;
        },
        error: (erro: unknown) => {
          console.error(erro);
          this.erroMensagem = 'Erro ao carregar livros.';
          this.loading = false;
        },
      });
  }

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (dados: Categoria[]) => {
        this.categorias = dados;
        this.carregandoCategorias = false;
      },
      error: (erro: unknown) => {
        console.error(erro);
        this.carregandoCategorias = false;
      },
    });
  }

  onFiltroChange(): void {
    this.filtroSubject.next();
  }

  limparFiltros(): void {
    this.termoBusca = '';
    this.categoriaFiltro = null;
    this.statusFiltro = null;
    this.filtroSubject.next();
  }

  deletarLivro(livro: Livro): void {
    if (livro.status !== Status.DISPONIVEL) {
      alert('Somente livros disponíveis podem ser excluídos.');
      return;
    }

    const ok = confirm('Confirmar exclusão?');
    if (!ok) return;

    this.livroService.deletar(livro.id).subscribe({
      next: () => {
        this.livros = this.livros.filter((l) => l.id !== livro.id);
      },
      error: (erro: any) => {
        alert(erro?.error?.message || 'Erro ao excluir livro.');
      },
    });
  }

  obterStatusBadgeClass(status: Status): string {
    switch (status) {
      case Status.DISPONIVEL:
        return 'badge-success';
      case Status.EMPRESTADO:
        return 'badge-warning';
      default:
        return '';
    }
  }
}
