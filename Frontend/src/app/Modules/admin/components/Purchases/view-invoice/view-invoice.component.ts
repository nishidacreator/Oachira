import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AdminService } from "../../../admin.service";
import { PurchaseInvoiceDetails } from "../../../models/purchase/purchaseInvoiceDetails";

@Component({
  selector: "app-view-invoice",
  templateUrl: "./view-invoice.component.html",
  styleUrls: ["./view-invoice.component.scss"],
})
export class ViewInvoiceComponent implements OnInit {
  @ViewChild("pdfContent") pdfContent!: ElementRef;
  invoiceDetails: any;
  vendorDetails: any;
  charges: any;

  constructor(
    private adminSerivce: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // ngOnDestroy(): void {
  //   this.pISubscription.unsubscribe();
  // }

  id: any;
  ngOnInit(): void {
    this.getPurchaseInvoiceDetails();
    this.id = this.route.snapshot.params["id"];

    // this.pISubscription = this.getPurchaseInvoiceDetails()

    const token: any = localStorage.getItem("token");
    let user = JSON.parse(token);
    this.id = user.id;
  }

//   ngAfterViewInit() {
//     // Ensure pdfContent is defined
//     if (this.pdfContent) {
//         console.log('pdfContent is initialized:', this.pdfContent.nativeElement);
//     } else {
//         console.error('pdfContent is not initialized.');
//     }
// }

  displayedColumns: string[] = [
    "id",
    "productId",
    "mrp",
    "quantity",
    "unitPrice",
    "discount",
    "netAmount",
    "tax",
    "taxAmount",
    "grossAmount",
  ];

  pIDetails: PurchaseInvoiceDetails[] = [];
  pISubscription!: Subscription;
  customer: any;
  getPurchaseInvoiceDetails() {
    return this.adminSerivce.getPurchaseInvoices().subscribe((res) => {
      this.invoiceDetails = res;
      this.vendorDetails = this.invoiceDetails.vendor;
      console.log(this.vendorDetails);
      // console.log(res)
      this.pIDetails = this.invoiceDetails.purchaseEntryDetails;
      console.log(this.pIDetails);
    });
  }

  cId!: number;
  editDetails(id: number) {
    this.router.navigateByUrl(
      "salesexecutive/picklist/view/picklistdetails/editdetails/" + id
    );
  }

  // deleteDetails(id : number){
  //   this.sEService.deletePickListDetails(id).subscribe((res)=>{
  //   })
  //   this.getPickListDetails()
  // }

  calculateLineAmount(item: any): number {
    return item.quantity * item.rate;
  }

  calculateTotalLineAmount(): number {
    let total = 0;
    if (this.invoiceDetails && this.invoiceDetails.purchaseEntryDetails) {
      for (const item of this.invoiceDetails.purchaseEntryDetails) {
        total += this.calculateLineAmount(item);
      }
    }
    return total;
  }

  calculateTax(item: any): number {
    return item.taxAmount;
  }

  calculateTotalTax(): number {
    let totalTax = 0;
    if (this.invoiceDetails && this.invoiceDetails.purchaseEntryDetails) {
      for (const item of this.invoiceDetails.purchaseEntryDetails) {
        const taxAmount = this.calculateTax(item);
        totalTax += taxAmount;
      }
    }
    return totalTax;
  }

  calculateTotalAmount(): number {
    return (
      this.calculateTotalLineAmount() +
      this.calculateTotalTax() +
      (this.charges || 0)
    );
  }

  download() {
     // Check if pdfContent is defined before printing
     if (this.pdfContent) {
      // Hide the header and navbar for printing
      const header = document.querySelector('header');
      const nav = document.querySelector('nav');
      if (header !== null) {
          header.style.display = 'none';
      }
      if (nav !== null) {
          nav.style.display = 'none';
      }

      // Trigger the print functionality for pdfContent
      this.pdfContent.nativeElement ? this.pdfContent.nativeElement.style.margin = '0' : '0';
      window.print();

      // Show the header and navbar again after printing
      if (header !== null) {
          header.style.display = 'block';
      }
      if (nav !== null) {
          nav.style.display = 'block';
      }

      // Reset the margin style after printing
      this.pdfContent.nativeElement ? this.pdfContent.nativeElement.style.margin = '' : '';
  } else {
      console.error("pdfContent element not found.");
  }
  }
}
