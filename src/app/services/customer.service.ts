import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  //getting all customers
  getCustomers(search?: string): Observable<Customer[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Customer[]>(this.apiUrl, { params });
  }

  //getting single customer
  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }


  //creating single customer 
  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  //editing customer
  updateCustomer(id: number, customer: Customer): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, customer);
  }

  //deleting a single customer
  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}