import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.topbar.component.html',
  styleUrl: './app.topbar.component.scss'
})
export class AppTopbarComponent {
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;
  
  constructor(
    public layoutService: LayoutService, 
    private router: Router
    ) {}

  get hidenNavbar(){
    return this.router.url === '/auth/login' ? true : false;
  }
}

