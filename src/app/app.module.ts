import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSortModule} from '@angular/material/sort';




import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';


import {  faBroom,  faSave, faBarcode, faTrashAlt, faUserEdit, faDoorClosed, faCheck, faUserCheck, faTrashRestore, faSignOutAlt,
  faSearch, faCircle, faMinusSquare, faFileExcel, faPrint, faSuitcase } from '@fortawesome/free-solid-svg-icons';
  import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
  import { DialogoComponent } from './main/otro/dialogo/dialogo.component';
  import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
  import { BundleBoxingComponent } from './main/inv/bundle-boxing/bundle-boxing.component';
  import {MatAutocompleteModule} from '@angular/material/autocomplete';

  import { UsuarioComponent } from './main/sis/usuario/usuario.component';
  import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
  

import { LoginService } from './main/Services/Usuario/login.service';
import { InventarioService } from './main/Services/inv/inventario.service';
import { BnNgIdleService } from 'bn-ng-idle';


import { AutofocusDirective } from './main/Directive/autofocus.directive';
import { AlertComponent } from './main/otro/alert/alert/alert.component';
import { ToastComponent } from './main/otro/toast/toast.component';
import { NgbToastModule } from  'ngb-toast';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportBundleBoxingComponent } from './main/inv/bundle-boxing/reporte/report-bundle-boxing/report-bundle-boxing.component';
import { ReportBundleBoxingTablaComponent } from './main/inv/bundle-boxing/reporte/report-bundle-boxing/report-bundle-boxing-tabla/report-bundle-boxing-tabla.component';
import { DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ReportViewerComponent } from './main/otro/report-viewer/report-viewer.component';


import { BoldReportViewerModule } from '@boldreports/angular-reporting-components';

// Report viewer
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';

// data-visualization
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min';
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min';


import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ReportViewerBoxingSerialComponent } from './main/inv/bundle-boxing-serial/ReportViewer/report-viewer-boxing-serial/report-viewer-boxing-serial.component';
import { BundleBoxingSerialComponent } from './main/inv/bundle-boxing-serial/bundle-boxing-serial/bundle-boxing-serial.component';
import { BundleBoxingSacoComponent } from './main/inv/bundle-boxing-saco/bundle-boxing-saco/bundle-boxing-saco.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    UsuarioComponent,
    DialogoComponent,
    BundleBoxingComponent,
    AutofocusDirective,
    AlertComponent,
    ToastComponent,
    ReportBundleBoxingComponent,
    ReportBundleBoxingTablaComponent,
    ReportViewerComponent,
    ReportViewerBoxingSerialComponent,
    BundleBoxingSerialComponent,
    BundleBoxingSacoComponent,
  

    
    


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxBarcodeModule,
    
    FormsModule,


    HttpClientModule,

    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCardModule,
    MatIconModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatSelectModule,
    



    ReactiveFormsModule,
    FontAwesomeModule,

    MatDialogModule,
    MatAutocompleteModule,
    NgbToastModule,
    NgbModule,
    BrowserModule,
    BoldReportViewerModule
    
  ],
  entryComponents: [
    DialogoComponent
  ],
  providers: [
    
    {provide: LocationStrategy, useClass: HashLocationStrategy},

    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, 
      useValue: "legacy",
   },

   
   {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
   {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
   { provide: MatPaginatorIntl, useValue: CustomPaginator() },

   
   DatePipe,


   LoginService,
   InventarioService,



   MatDatepickerModule,
   MatNativeDateModule,


   BnNgIdleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(library: FaIconLibrary) {
    // Add multiple icons to the library
    library.addIcons(faBroom, faSave, faBarcode, faTrashAlt, faUserEdit, faDoorClosed, faCheck, faUserCheck, faTrashRestore, faSignOutAlt,
      faSearch, faCircle, faMinusSquare, faFileExcel, faPrint, faSuitcase);
  }
}

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Registros por página:';

  return customPaginatorIntl;
}