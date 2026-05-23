import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DashboardResumo } from '../models/dashboard-resumo.model';
import { Emprestimo } from '../../emprestimos/models/emprestimo.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  obterResumo(): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(this.apiUrl);
  }

  obterUltimosEmprestimos(): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(`${this.apiUrl}/ultimos-emprestimos`);
  }
}
