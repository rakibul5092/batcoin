import { Component, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AgGridComponent, FileManagerService, SNACKBARTYPE, SocketService } from 'nextsapien-component-lib';

import { TranslateService } from '@ngx-translate/core';
import { Product } from 'src/app/modules/products/product.model';
import { ProductService } from 'src/app/modules/products/product.service';
import { SharedService } from 'src/app/shared/shared.service';
import { AgGridService } from '../../shared/ag-grid/ag-grid.service';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductDetailsViewComponent } from './product-details-view/product-details-view.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnDestroy {
  public products: Product[] = [];
  @ViewChild('productsGrid') productsGrid: AgGridComponent;
  public columnDefs: any[] = this.productService.constructColumnDefs(this);
  public showDeletedItems: boolean = false;
  public loading$: Observable<boolean>;
  private _unsubscribeAll: Subject<any>;
  public activeArray = [];
  public model = 'products';

  defaultColDef: any = {
    sortable: false,
    filter: true,
    lockPosition: false,
  };

  public columnsHideStrategy: Map<string, number>;

  constructor(
    private productService: ProductService,
    private sharedService: SharedService,
    private agGridService: AgGridService,
    private socket: SocketService,
    private fileManagerService: FileManagerService,
    private translateService: TranslateService,
  ) {
    this._unsubscribeAll = new Subject();
    productService.entities$.subscribe((value: any[]) => (this.products = this.showDeletedItems ? value.filter((item) => item.isDeleted) : value));
    this.loading$ = productService.loading$;

    this.columnsHideStrategy = this.productService.createColumnHideStrategy();

    this.onModuleChanges();
  }

  ionViewWillEnter = () => this.getData();

  public pageChange = (event) => this.getData({}, '', event.pageSize, event.skip);

  public getData(conditions: Object = {}, populate: string = '', limit: string = '10', skip: string = '0') {
    conditions = {
      isDeleted: this.showDeletedItems,
    };
    this.productService.clearCache();
    this.productService.getWithPopulatedFields(conditions, populate, limit, skip, '-created_at');
  }

  public addEditItem(product: any = {}) {
    this.agGridService.afterDialogClosed(ProductDetailComponent, product).subscribe((res) => {
      if (res) {
        const { value, progressiveImages } = res;
        if (value) {
          if (this.showDeletedItems) {
            this.toggleDeletedItems();
          }
          if (progressiveImages.length === 0) {
            value._id ? this.updateProduct(value) : this.addProduct(value);
            return;
          }
          value.progressiveImages = [];
          const deletedFiles = [];
          progressiveImages.forEach((image: any) => {
            if (!image.deleted) {
              value.imageUrl = image.label === 'imageUrl' ? image.url : value.imageUrl;
              value.backPath = image.label === 'backPath' ? image.url : value.backPath;
              value.progressiveImages.push({
                url: image.url,
                active: image.active,
                label: image.label,
              });
            } else {
              deletedFiles.push({ filename: image.url });
            }
          });
          if (deletedFiles.length === 0) {
            value._id ? this.updateProduct(value) : this.addProduct(value);
          } else {
            this.fileManagerService.deleteFileBulkFromAWS(deletedFiles).subscribe(() => {
              value._id ? this.updateProduct(value) : this.addProduct(value);
            });
          }
        }
      }
    });
  }

  public toggleDeletedItems() {
    this.showDeletedItems = !this.showDeletedItems;
    this.getData();
  }

  public delete(product: Product, permanentlyDelete: boolean = false) {
    this.productService.delete(product).subscribe(() => {
      if (product.progressiveImages && permanentlyDelete) {
        const deletedFiles = [];
        product.progressiveImages.forEach((image) => deletedFiles.push({ filename: image.url }));
        this.fileManagerService.deleteFileBulkFromAWS(deletedFiles, true).subscribe((res) => {});
      }
      this.translateService.get('SNACKBAR.DELETED_PRODUCT').subscribe((translation) => {
        this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });
  }

  public restore = (product: Product) =>
    this.productService.update({ ...product, isDeleted: false }).subscribe(() => {
      this.translateService.get('SNACKBAR.RESTORED_PRODUCT').subscribe((translation) => {
        this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });

  public viewProduct(product: Product) {
    this.agGridService.afterDialogClosed(ProductDetailsViewComponent, product).subscribe((res) => {});
  }

  public onRowToggleChange(row, rowIndex): void {
    this.productService.update({ ...row, active: !row.active }).subscribe((result) => {
      this.translateService.get('SNACKBAR.PRODUCT_STATUS_UPDATED').subscribe((translation) => {
        this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });
  }

  public onRowActionClick(action, row, rowIndex): void {
    switch (action) {
      case 'edit':
        this.addEditItem(row);
        break;
      case 'restore':
        this.restore(row);
        break;
      case 'delete':
        this.delete(row);
        break;
      case 'permanentlyDelete':
        this.delete(row, true);
        break;
      case 'view':
        this.viewProduct(row);
        break;
    }
  }

  private onModuleChanges() {
    this.socket.moduleChange.pipe(takeUntil(this._unsubscribeAll)).subscribe((change) => {
      if (change.module === 'products') {
        this.getData();
      }
    });
  }

  public saveDraggedPositions(draggedRows: any[]) {
    if (draggedRows) {
      this.productService.updateOrders(draggedRows).subscribe(() => {
        this.translateService.get('SNACKBAR.DP_SAVED_SUCCESSFULLY').subscribe((translation) => {
          this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
          this.productsGrid.resetDrag();
        });
      });
    }
  }

  public updateProduct(value): void {
    this.productService.update(value).subscribe(() => {
      this.translateService.get('SNACKBAR.UPDATED_PRODUCT').subscribe((translation) => {
        this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });
  }

  public addProduct(value): void {
    this.productService.add(value).subscribe(() => {
      this.translateService.get('SNACKBAR.ADDED_PRODUCT').subscribe((translation) => {
        this.sharedService.openSnackBar(translation, '', SNACKBARTYPE.success);
      });
    });
  }

  public onRowClicked = (e) => this.onRowActionClick(e.action, e.row, e.rowIndex);

  onExport(event) {
    this.productService.getWithPopulatedFields({}, '', null, '0', '-created_at').subscribe(() => {
      setTimeout(() => {
        event.gridApi.exportDataAsCsv({
          fileName: event.fileName,
          columnKeys: event.columnKeys,
        });
        this.getData();
      }, 2000);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
