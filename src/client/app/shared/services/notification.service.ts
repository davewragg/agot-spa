import {Injectable} from '@angular/core';
import {ToasterService} from 'angular2-toaster/angular2-toaster';

@Injectable()
export class NotificationService {
  constructor(private toasterService:ToasterService) {
  }

  success(title?:string, body?:string) {
    this.toasterService.pop('success', title, body);
  }

  warn(title?:string, body?:string) {
    this.toasterService.pop('warning', title, body);
  }

  error(title?:string, body?:string) {
    this.toasterService.pop('error', title, body);
  }

  info(title?:string, body?:string) {
    this.toasterService.pop('info', title, body);
  }

  wait(title?:string, body?:string) {
    this.toasterService.pop('wait', title, body);
  }
}
