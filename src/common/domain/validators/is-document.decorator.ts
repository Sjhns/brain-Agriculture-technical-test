import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DocumentValidator } from './document-validator';

@ValidatorConstraint({ async: false })
export class IsDocumentConstraint implements ValidatorConstraintInterface {
  validate(document: any) {
    if (typeof document !== 'string') return false;
    const cleanDoc = document.replace(/[^\d]+/g, '');
    if (cleanDoc.length === 11) {
      return DocumentValidator.isCpf(cleanDoc);
    } else if (cleanDoc.length === 14) {
      return DocumentValidator.isCnpj(cleanDoc);
    }
    return false;
  }

  defaultMessage() {
    return 'Document ($value) is not a valid CPF or CNPJ!';
  }
}

export function IsDocument(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDocumentConstraint,
    });
  };
}
