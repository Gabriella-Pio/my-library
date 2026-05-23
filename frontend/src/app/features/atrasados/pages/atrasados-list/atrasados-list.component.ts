import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { Atrasado } from '../../../emprestimos/models/atrasado.model';
import { EmprestimoService } from '../../../emprestimos/services/emprestimo.service';

@Component({
  selector: 'app-atrasados-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './atrasados-list.component.html',
  styleUrl: './atrasados-list.component.css',
})
export class AtrasadosListComponent implements OnInit {
  atrasados: Atrasado[] = [];
  loading = true;
  erroMensagem = '';

  constructor(private emprestimoService: EmprestimoService) {}

  ngOnInit(): void {
    this.carregarAtrasados();
  }

  carregarAtrasados(): void {
    this.loading = true;
    this.erroMensagem = '';

    this.emprestimoService.listarAtrasados().subscribe({
      next: (dados) => {
        this.atrasados = dados;
        this.loading = false;
      },
      error: (erro: unknown) => {
        console.error(erro);
        this.erroMensagem = 'Erro ao carregar empréstimos em atraso.';
        this.loading = false;
      },
    });
  }
}