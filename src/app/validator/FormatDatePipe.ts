import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';

import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';

// Register both locales
registerLocaleData(localeFr);
registerLocaleData(localeEn);

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string, format: string = 'medium', locale: string = 'en'): string {
    if (!value) return '';
    
    // Ensure we use a valid locale format (e.g., 'fr' becomes 'fr-FR')
    const localeCode = locale === 'en' ? 'en-US' : 'fr-FR';
    const datePipe = new DatePipe(localeCode);

    // Format map depending on locale
    const timeInclusiveFormats: Record<string, string> = locale === 'fr' ? {
      'short': 'dd/MM/yy HH:mm',
      'medium': 'd MMM y à HH:mm:ss',
      'long': 'd MMMM y à HH:mm:ss z',
      'full': 'EEEE d MMMM y à HH:mm',
      'shortTime': 'HH:mm',
      'mediumTime': 'HH:mm:ss',
      'custom': 'yyyy-MM-dd HH:mm:ss'
    } : {
      'short': 'M/d/yy, h:mm a',
      'medium': 'MMM d, y, h:mm:ss a',
      'long': 'MMMM d, y, h:mm:ss a z',
      'full': 'EEEE, MMMM d, y, h:mm a',
      'shortTime': 'h:mm a',
      'mediumTime': 'h:mm:ss a',
      'custom': 'yyyy-MM-dd HH:mm:ss'
    };

    // Use a time-inclusive format (defaults to 'medium' if no match)
    const timeFormat = timeInclusiveFormats[format] || format;
    return datePipe.transform(value, timeFormat) || '';
  }
}