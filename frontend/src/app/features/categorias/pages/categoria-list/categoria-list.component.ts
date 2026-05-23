import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { Categoria } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.css',
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  termoBusca = '';
  loading = true;
  erroMensagem = '';

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.loading = true;
    this.erroMensagem = '';

    this.categoriaService.listar().subscribe({
      next: (dados) => {
        this.categorias = dados;
        this.loading = false;
      },

      error: (erro) => {
        console.error('Erro ao carregar categorias', erro);
        this.erroMensagem = 'Não foi possível carregar as categorias.';
        this.loading = false;
      },
    });
  }

  deletarCategoria(id: number): void {
    const confirmou = confirm('Deseja realmente excluir essa categoria?');

    if (!confirmou) {
      return;
    }

    this.categoriaService.deletar(id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter(
          (categoria) => categoria.id !== id,
        );
      },

      error: (erro) => {
        console.error('Erro ao deletar categoria', erro);
        alert('Não foi possível excluir a categoria.');
      },
    });
  }

  get categoriasFiltradas(): Categoria[] {
    if (!this.termoBusca.trim()) {
      return this.categorias;
    }

    const termo = this.termoBusca.toLowerCase().trim();

    return this.categorias.filter((categoria) =>
      categoria.nome.toLowerCase().includes(termo),
    );
  }
}
