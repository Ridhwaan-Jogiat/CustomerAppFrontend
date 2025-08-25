import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-list.html',  
  styleUrls: ['./customer-list.css']   
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  showForm: boolean = false;
  currentCustomer: Customer = this.resetCustomer();
  isEditMode: boolean = false;
  formErrors: any = {};

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadCustomers();
    
    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after user stops typing
      distinctUntilChanged() // Only search if term actually changed
    ).subscribe(() => {
      this.loadCustomers();
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers(this.searchTerm).subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      }
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  showCreateForm(): void {
    this.currentCustomer = this.resetCustomer();
    this.showForm = true;
    this.isEditMode = false;
    this.formErrors = {};
  }

  editCustomer(customer: Customer): void {
    this.currentCustomer = { ...customer };
    this.showForm = true;
    this.isEditMode = true;
    this.formErrors = {};
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
        }
      });
    }
  }

  saveCustomer(): void {
    if (this.validateForm()) {
      if (this.isEditMode && this.currentCustomer.id) {
        this.customerService.updateCustomer(this.currentCustomer.id, this.currentCustomer).subscribe({
          next: () => {
            this.showForm = false;
            this.loadCustomers();
          },
          error: (error) => {
            console.error('Error updating customer:', error);
          }
        });
      } else {
        this.customerService.createCustomer(this.currentCustomer).subscribe({
          next: () => {
            this.showForm = false;
            this.loadCustomers();
          },
          error: (error) => {
            console.error('Error creating customer:', error);
          }
        });
      }
    }
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.currentCustomer.firstName || this.currentCustomer.firstName.trim() === '') {
      this.formErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!this.currentCustomer.surname || this.currentCustomer.surname.trim() === '') {
      this.formErrors.surname = 'Surname is required';
      isValid = false;
    }

    if (!this.currentCustomer.email || !this.isValidEmail(this.currentCustomer.email)) {
      this.formErrors.email = 'Valid email is required';
      isValid = false;
    }

    if (!this.currentCustomer.cellphone || this.currentCustomer.cellphone.trim() === '') {
      this.formErrors.cellphone = 'Cellphone is required';
      isValid = false;
    }

    if (!this.currentCustomer.type) {
      this.formErrors.type = 'Type is required';
      isValid = false;
    }

    if (this.currentCustomer.amountTotal < 0) {
      this.formErrors.amountTotal = 'Amount total cannot be negative';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  cancelForm(): void {
    this.showForm = false;
    this.currentCustomer = this.resetCustomer();
    this.formErrors = {};
  }

  resetCustomer(): Customer {
    return {
      firstName: '',
      surname: '',
      email: '',
      cellphone: '',
      type: 'Person',
      amountTotal: 0
    };
  }

  exportToCSV(): void {
    if (this.customers.length === 0) {
      alert('No customers to export');
      return;
    }

    // Define CSV headers
    const headers = ['First Name', 'Surname', 'Email', 'Cellphone', 'Type', 'Invoice Total'];
    
    // Convert customers to CSV rows
    const csvRows = this.customers.map(customer => [
      customer.firstName,
      customer.surname,
      customer.email,
      customer.cellphone,
      customer.type,
      customer.amountTotal.toString()
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}