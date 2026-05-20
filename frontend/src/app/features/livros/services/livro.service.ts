import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livro } from '../models/livro.model';
import { Status } from '../models/status.enum';

@Injectable({
  providedIn: 'root',
})
export class LivroService {
  private readonly apiUrl = 'http://localhost:8080/api/livros';

  constructor(private http: HttpClient) {}

  listar(): Observable<Livro[]> {
    return this.http.get<Livro[]>(this.apiUrl);
  }

  listarComFiltros(
    categoriaId?: number,
    status?: Status,
    termo?: string,
  ): Observable<Livro[]> {
    let params = new HttpParams();

    if (categoriaId) {
      params = params.set('categoriaId', categoriaId);
    }

    if (status) {
      params = params.set('status', status);
    }

    if (termo) {
      params = params.set('termo', termo);
    }

    return this.http.get<Livro[]>(this.apiUrl, { params });
  }

  criar(livro: Omit<Livro, 'id'>): Observable<Livro> {
    return this.http.post<Livro>(this.apiUrl, livro);
  }

  buscarPorId(id: number): Observable<Livro> {
    return this.http.get<Livro>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, livro: Omit<Livro, 'id'>): Observable<Livro> {
    return this.http.put<Livro>(`${this.apiUrl}/${id}`, livro);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
