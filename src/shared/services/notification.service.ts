import {Injectable} from 'angular2/core';
import {ToasterService} from 'angular2-toaster/angular2-toaster';

@Injectable()
export class NotificationService {
  constructor(private toasterService:ToasterService) {
  }

  success(...rest) {
    this.toasterService.pop('success', ...rest);
  }

  warn(...rest) {
    this.toasterService.pop('warning', ...rest);
  }

  error(...rest) {
    this.toasterService.pop('error', ...rest);
  }

  info(...rest) {
    this.toasterService.pop('info', ...rest);
  }

  wait(...rest) {
    this.toasterService.pop('wait', ...rest);
  }

}
