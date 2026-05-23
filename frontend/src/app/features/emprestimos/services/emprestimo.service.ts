import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Atrasado } from '../models/atrasado.model';
import { Emprestimo } from '../models/emprestimo.model';
import { EmprestimoRequest } from '../models/emprestimo-request.model';

@Injectable({
  providedIn: 'root',
})
export class EmprestimoService {
  private readonly apiUrl = 'http://localhost:8080/api/emprestimos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(this.apiUrl);
  }

  listarAtivos(): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(`${this.apiUrl}/ativos`);
  }

  listarAtrasados(): Observable<Atrasado[]> {
    return this.http.get<Atrasado[]>(`${this.apiUrl}/atrasados`);
  }

  buscarPorId(id: number): Observable<Emprestimo> {
    return this.http.get<Emprestimo>(`${this.apiUrl}/${id}`);
  }

  criar(dto: EmprestimoRequest): Observable<Emprestimo> {
    return this.http.post<Emprestimo>(`${this.apiUrl}/emprestar`, dto);
  }

  devolver(id: number): Observable<Emprestimo> {
    return this.http.patch<Emprestimo>(`${this.apiUrl}/${id}/devolver`, {});
  }

  obterHistoricoPorLivro(livroId: number): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(`${this.apiUrl}/livro/${livroId}`);
  }
}
