import { Injectable } from '@angular/core';

import { Categoria } from '../models/categoria.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly apiUrl = 'http://localhost:8080/api/categorias';

  constructor(private http: HttpClient) {}

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  criar(
    categoria: Omit<Categoria, 'id' | 'quantidadeLivros'>,
  ): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  atualizar(
    id: number,
    categoria: Omit<Categoria, 'id' | 'quantidadeLivros'>,
  ): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
